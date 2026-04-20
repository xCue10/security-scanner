"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, FileCode, ShieldCheck, AlertCircle, CheckCircle } from "lucide-react"

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
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Source Code Intelligence</h2>
          <p className="text-muted-foreground mt-1">Deep analysis of your codebase to identify vulnerabilities and leaks.</p>
        </div>
        <Button 
          onClick={runAudit} 
          disabled={loading}
          className="h-10 px-8 bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCode className="mr-2 h-4 w-4" />}
          Execute Audit
        </Button>
      </div>

      {!results && !loading && !error && (
        <Card className="bg-card/40 border-dashed border-border/60 py-20">
          <CardContent className="flex flex-col items-center text-center">
            <div className="bg-primary/5 p-4 rounded-full mb-6">
              <ShieldCheck className="h-12 w-12 text-primary/40" />
            </div>
            <h3 className="text-lg font-semibold italic text-muted-foreground">System Ready for Analysis</h3>
            <p className="text-sm text-muted-foreground/60 max-w-sm mt-2">
              Our engine will scan your repository for SQL injection, XSS, exposed secrets, and weak cryptographic patterns.
            </p>
          </CardContent>
        </Card>
      )}

      {results && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Vulnerability Summary</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-6">
                <div className="text-4xl font-black text-primary">{results.summary.total_findings}</div>
                <div className="h-10 w-px bg-border/40" />
                <div>
                  <p className="text-sm font-medium">Findings Detected</p>
                  <p className="text-xs text-muted-foreground">Across project source files</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Compliance Rating</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                {results.summary.total_findings === 0 ? (
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle className="h-6 w-6" />
                    <span className="text-xl font-bold tracking-tight">Enterprise Secure</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-yellow-500">
                    <AlertCircle className="h-6 w-6" />
                    <span className="text-xl font-bold tracking-tight">Review Recommended</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Vulnerability Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/40 hover:bg-transparent">
                    <TableHead className="text-[11px] font-bold uppercase text-muted-foreground">Severity</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-muted-foreground">Insight</TableHead>
                    <TableHead className="text-right text-[11px] font-bold uppercase text-muted-foreground">Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.findings.map((f: any, i: number) => (
                    <TableRow key={i} className="border-border/40 hover:bg-primary/5 transition-colors">
                      <TableCell>
                        <Badge className={`rounded-full px-3 text-[10px] font-bold ${
                          f.severity === 'ERROR' ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                        }`} variant="outline">
                          {f.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm font-medium leading-relaxed">{f.message}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1 font-mono">{f.check_id}</p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-xs font-medium text-muted-foreground">{f.path}</div>
                        <div className="text-[10px] text-primary font-bold">Line {f.line}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
