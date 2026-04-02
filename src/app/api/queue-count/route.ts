import { NextResponse } from "next/server";

export const revalidate = 300; // cache for 5 minutes

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "GitHub connection not configured" }, { status: 500 });
  }

  const res = await fetch(
    "https://api.github.com/repos/unicorn-mafia/members-db/pulls?state=open&per_page=1",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  if (!res.ok) {
    return NextResponse.json({ error: "GitHub API error" }, { status: 502 });
  }

  // GitHub returns total count in the Link header — parse last page number
  const link = res.headers.get("link") ?? "";
  const match = link.match(/[?&]page=(\d+)>; rel="last"/);
  const count = match ? parseInt(match[1], 10) : (await res.json()).length;

  return NextResponse.json({ count });
}
