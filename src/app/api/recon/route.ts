import { NextRequest, NextResponse } from "next/server";
import dns from 'dns/promises';

export async function POST(req: NextRequest) {
  try {
    const { domain } = await req.json();

    if (!domain) {
      return NextResponse.json({ error: "Domain required" }, { status: 400 });
    }

    const results: any = { domain };

    try {
      results.a = await dns.resolve4(domain);
    } catch (e) {}

    try {
      results.mx = await dns.resolveMx(domain);
    } catch (e) {}

    try {
      results.txt = await dns.resolveTxt(domain);
    } catch (e) {}

    try {
      results.ns = await dns.resolveNs(domain);
    } catch (e) {}

    return NextResponse.json(results);
  } catch (error) {
    console.error("Recon Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
