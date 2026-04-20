import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET() {
  try {
    const records = storage.getRecords();
    
    // Group records by date for the chart (last 7 days)
    const chartData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const dayRecords = records.filter((r: any) => 
        new Date(r.createdAt).toDateString() === date.toDateString()
      );

      return {
        name: dateStr,
        threats: dayRecords.filter((r: any) => r.severity === 'HIGH' || r.severity === 'CRITICAL').length,
        scans: dayRecords.length
      };
    }).reverse();

    // Calculate real stats
    const totalThreats = records.filter((r: any) => r.severity === 'HIGH' || r.severity === 'CRITICAL').length;
    const activeAssets = storage.getAssets().length;
    const totalVulns = records.reduce((acc: number, r: any) => {
      if (r.type === 'CODE' || r.type === 'DEPENDENCY') {
        try {
          const data = JSON.parse(r.data);
          return acc + (data.summary?.total || data.summary?.total_findings || 0);
        } catch(e) {}
      }
      return acc;
    }, 0);

    // Calculate score (out of 100)
    const baseScore = 100;
    const deduction = (totalThreats * 10) + (totalVulns * 2);
    const securityScore = Math.max(0, baseScore - deduction);

    return NextResponse.json({
      chartData,
      stats: {
        totalThreats,
        activeAssets,
        totalVulns,
        securityScore: `${securityScore}%`
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
