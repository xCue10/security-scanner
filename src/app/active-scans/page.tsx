"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Search, Terminal, BrainCircuit } from "lucide-react"
import { SecurityReport } from "@/components/security-report"

export default function ActiveScans() {
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

      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute scan')
      }

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

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze scan data')
      }

      setAiAnalysis(data.analysis)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="no-print space-y-6">
        <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Active_Scans</h2>
        
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">New_Scan_Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScan} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Target IP or Hostname (e.g., 127.0.0.1)"
                  className="pl-9 bg-background font-mono"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading || !target} className="bg-primary text-black hover:bg-primary/90">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Terminal className="mr-2 h-4 w-4" />}
                EXECUTE_SCAN
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="pt-6">
              <p className="text-destructive font-mono text-sm">ERROR: {error}</p>
            </CardContent>
          </Card>
        )}

        {scanResult && !aiAnalysis && (
          <Card className="bg-card border-border border-primary/30">
            <CardHeader className="border-b border-border">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Scan_Results :: {scanResult.target}</CardTitle>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-primary border-primary">{scanResult.status === 'up' ? 'ONLINE' : 'UNKNOWN'}</Badge>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="h-8 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    onClick={handleAIAnalysis}
                    disabled={analyzing}
                  >
                    {analyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                    GENERATE_AI_REPORT
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-muted-foreground">ADDRESS:</span> {scanResult.address}
                  </div>
                  <div>
                    <span className="text-muted-foreground">STATUS:</span> {scanResult.status}
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground h-8 text-[10px] uppercase">Port</TableHead>
                      <TableHead className="text-muted-foreground h-8 text-[10px] uppercase">Protocol</TableHead>
                      <TableHead className="text-muted-foreground h-8 text-[10px] uppercase">State</TableHead>
                      <TableHead className="text-muted-foreground h-8 text-[10px] uppercase">Service</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scanResult.ports?.map((p: any) => (
                      <TableRow key={p.portid} className="border-border h-8 hover:bg-primary/5">
                        <TableCell className="py-2 font-mono text-primary">{p.portid}</TableCell>
                        <TableCell className="py-2 font-mono">{p.protocol}</TableCell>
                        <TableCell className="py-2">
                          <Badge variant="outline" className={p.state === 'open' ? 'text-green-500 border-green-500/30' : 'text-muted-foreground'}>
                            {p.state}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 font-mono text-xs">{p.service}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {aiAnalysis && (
        <div className="print-container">
          <SecurityReport content={aiAnalysis} target={scanResult?.target} />
        </div>
      )}

      <div className="no-print">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Recent_Scan_Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">SCAN_ID</TableHead>
                  <TableHead className="text-muted-foreground">TARGET_NODE</TableHead>
                  <TableHead className="text-muted-foreground">STATUS</TableHead>
                  <TableHead className="text-muted-foreground">PROGRESS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-border italic opacity-50">
                  <TableCell className="font-mono">SCN-REALTIME</TableCell>
                  <TableCell className="font-mono">{target || "---"}</TableCell>
                  <TableCell>{loading ? "Running" : "Ready"}</TableCell>
                  <TableCell>{loading ? "Scanning..." : "0%"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
