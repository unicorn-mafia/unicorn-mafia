import { NextRequest, NextResponse } from "next/server";
import { load as loadHtml } from "cheerio";

interface OpenGraphResult {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
  author?: string;
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
      // @ts-expect-error - duplex isn't typed in fetch init here but helps some runtimes
      duplex: "half",
      signal: AbortSignal.timeout(5000), // 5 second timeout
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
    
    // Extract author from LinkedIn URL or meta tags
    let author: string | undefined;
    if (finalUrl.hostname.includes('linkedin.com')) {
      // Extract from LinkedIn post URL pattern: /posts/username_rest-of-url
      const postsMatch = finalUrl.pathname.match(/\/posts\/([^_\/]+)/);
      if (postsMatch) {
        const username = postsMatch[1];
        
        // Handle different username formats
        if (username.includes('-')) {
          // Format: adam-oneill-technical-founder -> Adam Oneill
          // Only take first two parts (first and last name)
          const parts = username.split('-');
          author = parts
            .slice(0, 2)
            .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join(' ');
        } else {
          // Format: davidgelberg, charliecheesman (all lowercase, no separator)
          // Use a mapping for known usernames
          const nameMap: Record<string, string> = {
            'davidgelberg': 'David Gelberg',
            'charliecheesman': 'Charlie Cheesman',
            'adamoneill': 'Adam Oneill',
          };
          
          if (nameMap[username.toLowerCase()]) {
            author = nameMap[username.toLowerCase()];
          } else {
            // Fallback: try camelCase detection
            const camelCased = username.replace(/([a-z])([A-Z])/g, '$1 $2');
            if (camelCased.includes(' ')) {
              // Had camelCase
              author = camelCased
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
            } else {
              // All lowercase, no clear boundary - just capitalize
              author = username.charAt(0).toUpperCase() + username.slice(1);
            }
          }
        }
      }
      
      // Fallback: Try to extract from /in/ profile URLs
      if (!author) {
        const profileMatch = finalUrl.pathname.match(/\/in\/([^\/]+)/);
        if (profileMatch) {
          author = profileMatch[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
      }
      
      // Fallback: Try from meta tags
      if (!author) {
        const articleAuthor = getMeta('meta[property="article:author"]') || getMeta('meta[name="author"]');
        if (articleAuthor) {
          author = articleAuthor;
        }
      }
      
      // Final fallback: Try to parse from the title
      if (!author && title) {
        const nameMatch = title.match(/^([^|,\-]+?)(?:\s+on LinkedIn|\s+posted|\s+shared|$)/i);
        if (nameMatch) {
          author = nameMatch[1].trim();
        }
      }
    } else {
      author = getMeta('meta[property="article:author"]') || getMeta('meta[name="author"]');
    }

    const payload: OpenGraphResult = {
      url: finalUrl.toString(),
      title,
      description,
      image,
      siteName,
      favicon,
      author,
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    return NextResponse.json({
      url: finalUrl.toString(),
      warning: "Failed to fetch or parse target URL",
    } as OpenGraphResult, { status: 200 });
  }
}

