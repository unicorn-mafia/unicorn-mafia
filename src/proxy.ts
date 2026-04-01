import { NextResponse } from "next/server";

const LOVABLE_ORIGIN = "https://london-to-sf.lovable.app";

export function proxy(request: Request & { nextUrl: URL }) {
  const { pathname, search } = request.nextUrl;

  // Proxy /london-to-sf and its sub-paths
  if (pathname === "/london-to-sf" || pathname.startsWith("/london-to-sf/")) {
    const target =
      pathname === "/london-to-sf"
        ? "/"
        : pathname.replace("/london-to-sf", "");
    return NextResponse.rewrite(new URL(target + search, LOVABLE_ORIGIN));
  }

  // Proxy /assets/* for Vite's absolute asset paths loaded by the Lovable app
  if (pathname.startsWith("/assets/")) {
    return NextResponse.rewrite(new URL(pathname, LOVABLE_ORIGIN));
  }
}

export const config = {
  matcher: ["/london-to-sf", "/london-to-sf/:path*", "/assets/:path*"],
};
