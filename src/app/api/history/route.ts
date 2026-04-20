import { NextResponse } from 'next/server';
import { readData } from '@/lib/storage';

export async function GET() {
  try {
    const history = readData('scan-records');
    return NextResponse.json(history);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
