"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Search, Activity, BrainCircuit, Globe } from "lucide-react"
import { SecurityReport } from "@/components/security-report"

export default function NetworkScan() {
  const [target, setTarget] = useState("")
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!target) return

    setLoading(true)
    setError(null)
    setScanResult(null)
    setAiAnalysis(null)

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to execute scan')
      setScanResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAIAnalysis = async () => {
    if (!scanResult) return
    setAnalyzing(true)
    setError(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanData: scanResult }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to analyze scan data')
      setAiAnalysis(data.analysis)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="no-print">
        <h2 className="text-3xl font-bold tracking-tight">Network Health Audit</h2>
        <p className="text-muted-foreground mt-1">Discover active services and assess exposed infrastructure.</p>
      </div>
      
      <div className="no-print">
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Audit Configuration</CardTitle>
            <CardDescription>Enter a domain or IP address to initiate a discovery scan.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScan} className="flex gap-4">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="e.g., scanme.nmap.org"
                  className="pl-10 h-10 bg-background"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading || !target} className="h-10 px-8 bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Activity className="mr-2 h-4 w-4" />}
                Run Discovery
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm font-medium">
          System Alert: {error}
        </div>
      )}

      {scanResult && !aiAnalysis && (
        <Card className="bg-card/50 border-border/50 shadow-xl no-print">
          <CardHeader className="border-b border-border/30 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-bold">Discovery Results: {scanResult.target}</CardTitle>
                <CardDescription>Active services identified at {scanResult.address}</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={scanResult.status === 'up' ? 'default' : 'secondary'} className="rounded-full px-3">
                  {scanResult.status === 'up' ? 'Online' : 'Status Unknown'}
                </Badge>
                <Button 
                  size="sm" 
                  className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded-full px-4"
                  onClick={handleAIAnalysis}
                  disabled={analyzing}
                >
                  {analyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                  AI Intelligence
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead className="w-[100px] text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Port</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Protocol</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Service</TableHead>
                  <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scanResult.ports?.map((p: any) => (
                  <TableRow key={p.portid} className="border-border/40 hover:bg-primary/5 transition-colors">
                    <TableCell className="font-semibold text-primary">{p.portid}</TableCell>
                    <TableCell className="text-xs uppercase text-muted-foreground">{p.protocol}</TableCell>
                    <TableCell className="font-medium">{p.service}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className={`rounded-full border-none px-0 ${p.state === 'open' ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {p.state}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {aiAnalysis && (
        <div className="print-container">
          <SecurityReport content={aiAnalysis} target={scanResult?.target} />
        </div>
      )}
    </div>
  )
}
