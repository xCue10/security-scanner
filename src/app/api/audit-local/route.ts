import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { auditCodeForSecrets } from "@/lib/scannerEngine";

function getFiles(dir: string, fileList: { name: string, content: string }[] = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
        getFiles(filePath, fileList);
      }
    } else {
      // Only scan text-based files
      if (['.ts', '.tsx', '.js', '.jsx', '.env', '.json', '.md'].some(ext => file.endsWith(ext))) {
        const content = fs.readFileSync(filePath, 'utf8');
        fileList.push({ name: filePath.replace(process.cwd(), ''), content });
      }
    }
  });
  return fileList;
}

export async function GET(req: NextRequest) {
  try {
    const projectRoot = process.cwd();
    const allFiles = getFiles(projectRoot);
    const results = auditCodeForSecrets(allFiles);
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Local Audit Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
