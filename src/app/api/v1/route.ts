import { NextResponse } from "next/server";

export async function GET() {
	return new NextResponse("https://github.com/unicorn-mafia", {
		status: 200,
		headers: { "content-type": "text/plain; charset=utf-8" },
	});
}

export async function POST() {
	return new NextResponse("unicorn mafia", {
		status: 200,
		headers: { "content-type": "text/plain; charset=utf-8" },
	});
}

