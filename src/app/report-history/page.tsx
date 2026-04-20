"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Shield, ExternalLink, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function ReportHistory() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history')
      const data = await response.json()
      if (response.ok) setReports(data)
    } catch (error) {
      console.error("Failed to fetch history")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const filteredReports = reports.filter(r => 
    r.target.toLowerCase().includes(filter.toLowerCase()) ||
    r.type.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Audit History</h2>
        <p className="text-muted-foreground mt-1">Review and analyze previous security assessments and intelligence reports.</p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Filter by target or type..." 
            className="pl-10 bg-card/50"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Historical Records</CardTitle>
          <CardDescription>Comprehensive log of all infrastructure and source code audits.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/40 hover:bg-transparent">
                <TableHead className="text-[11px] font-bold uppercase text-muted-foreground">Type</TableHead>
                <TableHead className="text-[11px] font-bold uppercase text-muted-foreground">Target</TableHead>
                <TableHead className="text-[11px] font-bold uppercase text-muted-foreground">Severity</TableHead>
                <TableHead className="text-[11px] font-bold uppercase text-muted-foreground text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length > 0 ? filteredReports.map((report) => (
                <TableRow key={report.id} className="border-border/40 hover:bg-primary/5 transition-colors cursor-pointer group">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Shield className="h-3 w-3 text-primary/60" />
                      <span className="font-bold text-[10px] uppercase tracking-tighter">{report.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-sm">{report.target}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`rounded-full px-3 text-[10px] font-bold ${
                      report.severity === 'CRITICAL' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                      report.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                      'bg-primary/10 text-primary border-primary/20'
                    }`}>
                      {report.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                      <Calendar className="h-3 w-3" />
                      {new Date(report.createdAt).toLocaleDateString()}
                      <ExternalLink className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100" />
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic text-xs">
                    {loading ? "Decrypting database records..." : "No historical records matching current filter."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
