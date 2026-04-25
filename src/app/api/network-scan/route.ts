import { NextRequest, NextResponse } from "next/server";
import { scanPorts } from "@/lib/networkSentinel";

export async function POST(req: NextRequest) {
  try {
    const { host } = await req.json();

    if (!host) {
      return NextResponse.json({ error: "Host required" }, { status: 400 });
    }

    const results = await scanPorts(host);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Network Scan Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
