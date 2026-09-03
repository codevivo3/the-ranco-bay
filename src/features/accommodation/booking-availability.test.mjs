import {test} from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {createRequire} from "node:module";
import {fileURLToPath} from "node:url";
import ts from "typescript";

const nativeRequire = createRequire(import.meta.url);
const directory = path.dirname(fileURLToPath(import.meta.url));

// Compile the real modules in isolation; no private env, network or Next cache.
function load(name, overrides = {}, globals = {}) {
  const exports = {};
  const source = fs.readFileSync(path.join(directory, `${name}.ts`), "utf8");
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022},
  }).outputText, {
    exports, Date, Intl, URL, Buffer, TextDecoder, AbortSignal,
    require: (id) => Object.hasOwn(overrides, id) ? overrides[id]
      : id.startsWith("./") ? load(id.slice(2), overrides, globals) : nativeRequire(id),
    ...globals,
  });
  return exports;
}
const {parseBookingICal} = load("booking-ical-parser");
const {getDayStatus} = load("availability-dates");
const calendar = (events = "") => `BEGIN:VCALENDAR\r\nVERSION:2.0\r\n${events}END:VCALENDAR\r\n`;
const event = (fields) => `BEGIN:VEVENT\r\n${fields}\r\nEND:VEVENT\r\n`;
const valid = calendar(event("DTSTART;VALUE=DATE:20260910\r\nDTEND;VALUE=DATE:20260915"));
const plain = (value) => JSON.parse(JSON.stringify(value));

test("exclusive end, folded lines, sorted events and sanitized metadata", () => {
  const source = calendar(event("DTSTART;VALUE=DATE:202609\r\n 10\r\nDTEND:20260915\r\nSUMMARY:Private guest") +
    event("DTSTART:20260831\r\nDTEND:20260901"));
  assert.deepEqual(plain(parseBookingICal(source)), [
    {start: "2026-08-31", end: "2026-08-31"}, {start: "2026-09-10", end: "2026-09-14"},
  ]);
  const data = {reviewedRange: null, unavailableRanges: parseBookingICal(valid)};
  assert.equal(getDayStatus("2026-09-14", "2026-09-01", data), "unavailable");
  assert.equal(getDayStatus("2026-09-15", "2026-09-01", data), "unknown");
});

test("leap days, year boundaries, single-day and empty/cancelled calendars", () => {
  assert.deepEqual(plain(parseBookingICal(calendar(event("DTSTART:20280228\r\nDTEND:20280301"))))[0],
    {start: "2028-02-28", end: "2028-02-29"});
  assert.equal(parseBookingICal(calendar(event("DTSTART:20261231\r\nDTEND:20270101")))[0].end, "2026-12-31");
  assert.equal(parseBookingICal(calendar(event("DTSTART:20260910")))[0].end, "2026-09-10");
  assert.equal(parseBookingICal(calendar()).length, 0);
  assert.equal(parseBookingICal(calendar(event("STATUS:CANCELLED"))).length, 0);
});

test("reject malformed, invalid, timed and unsupported events rather than partial data", () => {
  for (const fields of ["DTSTART:20260229", "DTSTART:20261301", "DTEND:20260915",
    "DTSTART:20260910\r\nDTEND:20260910", "DTSTART:20260910\r\nDTEND:20260909",
    "DTSTART:20260910T000000Z", "DTSTART;TZID=Europe/Rome:20260910",
    "DTSTART:20260910\r\nRRULE:FREQ=DAILY", "DTSTART:20260910\r\nEXDATE:20260911",
    "DTSTART:20260910\r\nDURATION:P2D", "DTSTART:20260910\r\nDTSTART:20260911"]) {
    assert.throws(() => parseBookingICal(calendar(event(fields))));
  }
  for (const source of ["<html>Error</html>", "", valid.replace("END:VEVENT", "END:OTHER"), valid.replace("VERSION:2.0", "VERSION:1.0")]) {
    assert.throws(() => parseBookingICal(source));
  }
});

const local = {reviewedRange: {start: "2026-09-01", end: "2026-09-30"}, unavailableRanges: [{start: "2026-09-20", end: "2026-09-20"}]};
function adapter({url = "https://ical.booking.com/private-test-token", fetcher = async () => new Response(valid), stale = false, cacheError = false} = {}) {
  let calls = 0;
  let cached;
  const adapterModule = load("booking-availability", {
    "server-only": {}, "./availability-data": {accommodationAvailability: local},
    "next/server": {connection: async () => {}},
    "next/cache": {unstable_cache: (fn, keys, options) => {
      assert.equal(options.revalidate, 1200);
      assert(!keys.join("").includes("private-test-token"));
      return async () => {
        if (cacheError) throw new Error("Cache failed");
        cached ??= await fn();
        return stale ? {...cached, checkedAt: Date.now() - 1_200_001} : cached;
      };
    }},
  }, {
    process: {env: {BOOKING_ICAL_URL: url}},
    fetch: async (...args) => {
      calls++;
      assert.equal(args[1].cache, "no-store");
      assert.equal(args[1].redirect, "error");
      assert(args[1].signal instanceof AbortSignal);
      return fetcher(...args);
    },
  });
  return {get: adapterModule.getBookingAvailability, calls: () => calls};
}

test("successful feed merges local blocks; cached snapshot reuses fetch", async () => {
  const service = adapter();
  const data = await service.get();
  await service.get();
  assert.equal(service.calls(), 1);
  assert.deepEqual(plain(data.reviewedRange), local.reviewedRange);
  assert.equal(data.unavailableRanges.length, 2);
  assert.equal(getDayStatus("2026-09-15", "2026-09-01", data), "available");
});

test("invalid/missing URLs never fetch or expose availability", async () => {
  for (const url of [undefined, "", "not-a-url", "http://ical.booking.com/test", "https://localhost/test", "https://booking.com.evil.test/test", "https://user:pass@booking.com/test"]) {
    const service = adapter({url: url ?? ""});
    const data = await service.get();
    assert.equal(service.calls(), 0);
    assert.equal(data.reviewedRange, null);
  }
});

test("network/HTTP/parser/size/cache/stale failures preserve safe local blocks only", async () => {
  for (const options of [
    {fetcher: async () => {throw new Error("network error with secret URL");}},
    {fetcher: async () => new Response("failed", {status: 503})},
    {fetcher: async () => new Response("bad feed")},
    {fetcher: async () => new Response("x".repeat(1_048_577))},
    {stale: true}, {cacheError: true},
  ]) {
    const data = await adapter(options).get();
    assert.equal(data.reviewedRange, null);
    assert.deepEqual(plain(data.unavailableRanges), local.unavailableRanges);
    assert.equal(getDayStatus("2026-09-15", "2026-09-01", data), "unknown");
  }
});
