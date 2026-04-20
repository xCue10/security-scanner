import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { scanData } = await req.json();

    if (!scanData) {
      return NextResponse.json({ error: 'No scan data provided' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
      return NextResponse.json({ 
        error: 'Gemini API Key is not configured. Please add it to .env.local' 
      }, { status: 501 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
      You are a Senior Cyber Security Architect. Analyze the following raw security scan data and provide a professional report for a CISO.
      
      RAW SCAN DATA:
      ${JSON.stringify(scanData, null, 2)}

      Please structure your response in clear sections:
      1. **Executive Summary**: A high-level overview of the security posture and the most critical risks discovered.
      2. **Risk Analysis**: A breakdown of specific vulnerabilities and their potential impact on business operations.
      3. **Remediation Plan**: A step-by-step, prioritized technical and organizational plan to mitigate the risks.
      4. **Conclusion**: Final assessment.

      Use professional, concise language. Format the output with clear Markdown headers.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ analysis: text });

  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
