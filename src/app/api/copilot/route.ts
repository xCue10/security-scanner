import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: NextRequest) {
  try {
    const { question, logs } = await req.json();

    const prompt = `
      You are Vanguard AI, a security copilot. You have access to the current session's security logs.
      Answer the user's question based ONLY on the provided log data.
      If the data doesn't contain the answer, say you don't see that in the logs.
      Be concise, professional, and highlight specific risks.

      Logs:
      ${JSON.stringify(logs.slice(0, 50).map(l => ({ source: l.source, msg: l.message, risk: l.riskScore })))}

      User Question: ${question}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return NextResponse.json({ answer: response.text() });
  } catch (error) {
    console.error("Copilot Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
