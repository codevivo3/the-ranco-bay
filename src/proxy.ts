import createMiddleware from "next-intl/middleware";
import {NextRequest, NextResponse} from "next/server";
import {routing} from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);
const localizedHomePaths = new Set(
  routing.locales
    .filter((locale) => locale !== routing.defaultLocale)
    .map((locale) => `/${locale}`),
);

export default function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl;

  if (localizedHomePaths.has(pathname)) {
    const destination = new URL(request.url);
    destination.pathname = `${pathname}/`;

    return NextResponse.redirect(destination, 308);
  }

  if (
    pathname.length > 1 &&
    pathname.endsWith("/") &&
    !localizedHomePaths.has(pathname.slice(0, -1))
  ) {
    const destination = new URL(request.url);
    destination.pathname = pathname.replace(/\/+$/, "");

    return NextResponse.redirect(destination, 308);
  }

  const response = handleI18nRouting(request);

  if (
    (pathname === "/en" || pathname.startsWith("/en/")) &&
    response.headers.has("location")
  ) {
    return new NextResponse(null, {
      headers: response.headers,
      status: 308,
    });
  }

  return response;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
