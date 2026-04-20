"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer, ShieldCheck, Download } from "lucide-react"

interface SecurityReportProps {
  content: string;
  target: string;
}

export function SecurityReport({ content, target }: SecurityReportProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      <div className="flex justify-between items-center print:hidden">
        <h3 className="text-lg font-bold text-primary uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          AI_Security_Intelligence_Report
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            PRINT_REPORT
          </Button>
        </div>
      </div>

      <Card className="bg-card border-border border-primary/20 shadow-2xl print:border-none print:shadow-none">
        <CardHeader className="border-b border-border bg-muted/30 print:bg-transparent">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-black uppercase tracking-tighter text-primary">SEC_AUDIT_INTELLIGENCE</CardTitle>
              <p className="text-xs text-muted-foreground font-mono mt-1">CONFIDENTIAL // TOP SECRET // TARGET: {target}</p>
            </div>
            <div className="text-right text-[10px] font-mono text-muted-foreground">
              GEN_DATE: {new Date().toLocaleDateString()}<br />
              CLASS: LEVEL_4_CISO
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8 pb-12 px-8 sm:px-12 prose prose-invert max-w-none">
          <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
          
          <div className="mt-12 pt-8 border-t border-border flex justify-between items-end opacity-50 text-[10px] font-mono">
            <div>
              REPORT_ID: {Math.random().toString(36).substring(2, 15).toUpperCase()}<br />
              AUTHORIZED_BY: GEMINI_INTEL_SYSTEMS
            </div>
            <div className="text-right italic">
              Property of SEC_AUDIT Dashboard v1.0
            </div>
          </div>
        </CardContent>
      </Card>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
