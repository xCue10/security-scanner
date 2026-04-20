"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, PackageSearch, ShieldCheck, AlertCircle, CheckCircle, Info } from "lucide-react"

export default function DependencyAudit() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const runAudit = async () => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/trivy', { method: 'POST' })
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
          <h2 className="text-3xl font-bold tracking-tight">Dependency Intelligence</h2>
          <p className="text-muted-foreground mt-1">Audit supply-chain risks and identify vulnerable software packages.</p>
        </div>
        <Button 
          onClick={runAudit} 
          disabled={loading}
          className="h-10 px-8 bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PackageSearch className="mr-2 h-4 w-4" />}
          Scan Dependencies
        </Button>
      </div>

      {!results && !loading && !error && (
        <Card className="bg-card/40 border-dashed border-border/60 py-20">
          <CardContent className="flex flex-col items-center text-center">
            <div className="bg-primary/5 p-4 rounded-full mb-6">
              <ShieldCheck className="h-12 w-12 text-primary/40" />
            </div>
            <h3 className="text-lg font-semibold italic text-muted-foreground">Supply Chain Engine Ready</h3>
            <p className="text-sm text-muted-foreground/60 max-w-sm mt-2">
              Checks your package-lock.json for CVEs (Common Vulnerabilities and Exposures).
            </p>
          </CardContent>
        </Card>
      )}

      {results && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">CVE Summary</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-8">
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-black text-destructive">{results.summary.critical}</div>
                  <p className="text-[10px] font-bold text-destructive uppercase mt-1">Critical</p>
                </div>
                <div className="h-10 w-px bg-border/40" />
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-black text-orange-500">{results.summary.high}</div>
                  <p className="text-[10px] font-bold text-orange-500 uppercase mt-1">High Risk</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Supply Chain Status</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                {results.summary.total === 0 ? (
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle className="h-6 w-6" />
                    <span className="text-xl font-bold tracking-tight">Verified Secure</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-6 w-6" />
                    <span className="text-xl font-bold tracking-tight">Immediate Action Required</span>
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
              {results.findings.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/40 hover:bg-transparent">
                      <TableHead className="text-[11px] font-bold uppercase text-muted-foreground">Severity</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase text-muted-foreground">Package Info</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase text-muted-foreground">Vulnerability Details</TableHead>
                      <TableHead className="text-right text-[11px] font-bold uppercase text-muted-foreground">Resolution</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.findings.map((f: any, i: number) => (
                      <TableRow key={i} className="border-border/40 hover:bg-primary/5 transition-colors">
                        <TableCell>
                          <Badge className={`rounded-full px-3 text-[10px] font-bold uppercase ${
                            f.severity === 'CRITICAL' ? 'bg-destructive' : 'bg-orange-500'
                          }`}>
                            {f.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-bold text-primary">{f.package}</p>
                          <p className="text-[10px] text-muted-foreground">Installed: {f.version}</p>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-xs font-medium leading-relaxed truncate">{f.title || f.id}</p>
                          <p className="text-[9px] text-muted-foreground mt-1 uppercase font-mono">{f.id}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="text-xs font-bold text-green-500">Update to {f.fixed_version || 'Latest'}</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-6 text-center text-primary font-mono text-xs">
                  NO_PACKAGE_VULNERABILITIES_DETECTED
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
