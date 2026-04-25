import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: NextRequest) {
  try {
    const { logs } = await req.json();

    if (!logs || !Array.isArray(logs)) {
      return NextResponse.json({ error: "Invalid logs provided" }, { status: 400 });
    }

    const prompt = `
      You are a senior security forensic analyst. Analyze the following security logs and identify potential threats, anomalies, or suspicious patterns.
      For each log entry or cluster of entries, provide:
      1. A risk score (0-100).
      2. A brief analysis of the activity.
      3. MITRE ATT&CK mapping if applicable.
      4. Recommended mitigation steps.

      Logs:
      ${JSON.stringify(logs.map(l => ({ id: l.id, message: l.message, source: l.source })))}

      Return the analysis in a structured JSON format:
      {
        "analyses": [
          {
            "id": "log_id",
            "riskScore": number,
            "analysis": "string",
            "mitreAttack": "string (optional)",
            "mitigation": "string"
          }
        ],
        "summary": "overall summary of the batch"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Attempt to parse the JSON from the markdown response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const analysisData = jsonMatch ? JSON.parse(jsonMatch[0]) : { analyses: [], summary: "Failed to parse analysis" };

    return NextResponse.json(analysisData);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
