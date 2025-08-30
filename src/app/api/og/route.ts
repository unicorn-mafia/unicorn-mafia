import { NextRequest, NextResponse } from "next/server";
import { load as loadHtml } from "cheerio";

interface OpenGraphResult {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
  warning?: string;
}

function toAbsoluteUrl(possiblyRelativeUrl: string | undefined, baseUrl: URL): string | undefined {
  if (!possiblyRelativeUrl) return undefined;
  try {
    return new URL(possiblyRelativeUrl, baseUrl).toString();
  } catch {
    return undefined;
  }
}

export async function GET(request: NextRequest) {
  const targetUrl = request.nextUrl.searchParams.get("url");
  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let finalUrl: URL;
  try {
    finalUrl = new URL(targetUrl);
  } catch {
    return NextResponse.json({ error: "Invalid url parameter" }, { status: 400 });
  }

  try {
    const response = await fetch(finalUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      cache: "no-store",
      // @ts-expect-error - duplex isn't typed in fetch init here but helps some runtimes
      duplex: "half",
    });

    if (!response.ok) {
      return NextResponse.json({
        url: finalUrl.toString(),
        warning: `Upstream responded with status ${response.status}`,
      } satisfies OpenGraphResult, { status: 200 });
    }

    const html = await response.text();
    const $ = loadHtml(html);

    const getMeta = (selector: string, attr: "content" | "href" = "content") =>
      $(selector).attr(attr) || undefined;

    const title = getMeta('meta[property="og:title"]') || getMeta('meta[name="twitter:title"]') || $("title").first().text() || undefined;
    const description =
      getMeta('meta[property="og:description"]') ||
      getMeta('meta[name="description"]') ||
      getMeta('meta[name="twitter:description"]') ||
      undefined;
    const imageRaw = getMeta('meta[property="og:image"]') || getMeta('meta[name="twitter:image"]') || undefined;
    const siteName = getMeta('meta[property="og:site_name"]') || finalUrl.hostname;
    const faviconRaw =
      $('link[rel~="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      "/favicon.ico";

    const image = toAbsoluteUrl(imageRaw, finalUrl);
    const favicon = toAbsoluteUrl(faviconRaw, finalUrl);

    const payload: OpenGraphResult = {
      url: finalUrl.toString(),
      title,
      description,
      image,
      siteName,
      favicon,
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    return NextResponse.json({
      url: finalUrl.toString(),
      warning: "Failed to fetch or parse target URL",
    } as OpenGraphResult, { status: 200 });
  }
}

