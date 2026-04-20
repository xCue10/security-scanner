"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, ShieldCheck, AlertTriangle, FileCode, CheckCircle2 } from "lucide-react"

export default function CodeAudit() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const runAudit = async () => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/audit', { method: 'POST' })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Audit failed')
      setResults(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Static_Analysis</h2>
        <Button 
          onClick={runAudit} 
          disabled={loading}
          className="bg-primary text-black hover:bg-primary/90 font-bold"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCode className="mr-2 h-4 w-4" />}
          RUN_PROJECT_AUDIT
        </Button>
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive font-mono text-sm">CRITICAL_FAILURE: {error}</p>
          </CardContent>
        </Card>
      )}

      {!results && !loading && !error && (
        <Card className="bg-card border-dashed border-border py-12">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <ShieldCheck className="h-12 w-12 text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground font-mono text-sm uppercase">Source code analysis engine ready.</p>
            <p className="text-[10px] text-muted-foreground/50 mt-1">Scan will check for OWASP vulnerabilities, hardcoded secrets, and best practices.</p>
          </CardContent>
        </Card>
      )}

      {results && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase text-muted-foreground tracking-widest">Total Findings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${results.summary.total_findings > 0 ? 'text-yellow-500' : 'text-primary'}`}>
                  {results.summary.total_findings}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase text-muted-foreground tracking-widest">Security Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {results.summary.total_findings === 0 ? (
                    <>
                      <CheckCircle2 className="text-primary h-5 w-5" />
                      <span className="text-primary font-bold">SECURE</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="text-yellow-500 h-5 w-5" />
                      <span className="text-yellow-500 font-bold">WARNING</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Vulnerability_Report</CardTitle>
            </CardHeader>
            <CardContent>
              {results.findings.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground uppercase text-[10px]">Severity</TableHead>
                      <TableHead className="text-muted-foreground uppercase text-[10px]">Issue</TableHead>
                      <TableHead className="text-muted-foreground uppercase text-[10px]">Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.findings.map((f: any, i: number) => (
                      <TableRow key={i} className="border-border hover:bg-muted/30">
                        <TableCell>
                          <Badge variant="outline" className={
                            f.severity === 'ERROR' ? 'text-destructive border-destructive' : 'text-yellow-500 border-yellow-500'
                          }>
                            {f.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className="text-xs font-mono line-clamp-2">{f.message}</p>
                          <p className="text-[9px] text-muted-foreground mt-1 uppercase tracking-tighter">{f.check_id}</p>
                        </TableCell>
                        <TableCell className="font-mono text-[10px]">
                          <span className="text-muted-foreground">{f.path}</span>
                          <span className="text-primary ml-1">:{f.line}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-6 text-center text-primary font-mono text-xs">
                  NO_VULNERABILITIES_DETECTED_IN_SOURCE_CODE
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
