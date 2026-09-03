import "server-only";

import {createHash} from "node:crypto";
import {unstable_cache} from "next/cache";
import {connection} from "next/server";

import {accommodationAvailability} from "./availability-data";
import type {AvailabilityData, DateRange} from "./availability-dates";
import {parseBookingICal} from "./booking-ical-parser";

const CACHE_SECONDS = 20 * 60;
const MAX_FEED_BYTES = 1024 * 1024;
type Snapshot = {checkedAt: number; ranges: DateRange[] | null};

function feedUrl(): URL | null {
  try {
    const url = new URL(process.env.BOOKING_ICAL_URL ?? "");
    // This adapter is only for Booking.com exports, not arbitrary server URLs.
    if (url.protocol !== "https:" || url.username || url.password || url.port ||
      !(url.hostname === "booking.com" || url.hostname.endsWith(".booking.com"))) return null;
    return url;
  } catch {
    return null;
  }
}

async function readFeed(response: Response): Promise<string> {
  if (!response.ok || !response.body || Number(response.headers.get("content-length")) > MAX_FEED_BYTES) {
    throw new Error("Unavailable calendar feed");
  }
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_FEED_BYTES) throw new Error("Calendar feed too large");
      chunks.push(value);
    }
    return new TextDecoder("utf-8", {fatal: true}).decode(Buffer.concat(chunks));
  } finally {
    await reader.cancel();
  }
}

export async function getBookingAvailability(): Promise<AvailabilityData> {
  // Evaluate freshness per request, not in a permanently prerendered Contact page.
  await connection();
  const fallback: AvailabilityData = {...accommodationAvailability, reviewedRange: null};
  const url = feedUrl();
  if (!url) return fallback;
  // A URL rotation invalidates the cache without putting the private URL in keys.
  const fingerprint = createHash("sha256").update(url.href).digest("hex");
  const readSnapshot = unstable_cache(async (): Promise<Snapshot> => {
    try {
      const response = await fetch(url, {
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(10_000),
        headers: {Accept: "text/calendar"},
      });
      const ranges = parseBookingICal(await readFeed(response));
      return {checkedAt: Date.now(), ranges};
    } catch {
      // Never log fetch errors: they can include the private export URL.
      return {checkedAt: Date.now(), ranges: null};
    }
  }, ["booking-availability-v1", fingerprint], {revalidate: CACHE_SECONDS});

  try {
    const snapshot = await readSnapshot();
    // Next may return stale data while revalidating. Do not present it as current.
    if (!snapshot.ranges || Date.now() - snapshot.checkedAt >= CACHE_SECONDS * 1000) return fallback;
    return {
      ...accommodationAvailability,
      unavailableRanges: [...accommodationAvailability.unavailableRanges, ...snapshot.ranges],
    };
  } catch {
    return fallback;
  }
}
