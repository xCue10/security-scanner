import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: NextRequest) {
  try {
    const { target } = await req.json();

    const prompt = `
      You are a specialized OSINT (Open Source Intelligence) analyst. 
      Analyze the following target (email or domain) for potential public data breaches or credential leaks: ${target}
      
      Cross-reference your knowledge base for major breaches involving this domain or email pattern.
      Provide a report in JSON format:
      {
        "status": "compromised | secure | suspicious",
        "leaks": [
          {
            "name": "string (name of the breach)",
            "date": "string",
            "dataLeaked": "string (e.g., passwords, emails, IPs)",
            "severity": "high | medium | low"
          }
        ],
        "recommendation": "string"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const report = jsonMatch ? JSON.parse(jsonMatch[0]) : { status: "unknown", leaks: [] };

    return NextResponse.json(report);
  } catch (error) {
    console.error("Breach Scan Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
