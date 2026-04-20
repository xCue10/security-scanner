import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ReportHistory() {
  const reports = [
    { id: "REP-2026-004", date: "2026-04-15", type: "Full Audit", severity: "Clean" },
    { id: "REP-2026-003", date: "2026-04-08", type: "Pen-Test", severity: "Medium" },
    { id: "REP-2026-002", date: "2026-04-01", type: "Vuln Scan", severity: "High" },
    { id: "REP-2026-001", date: "2026-03-25", type: "Full Audit", severity: "Clean" },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Report_History</h2>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Archived_Audits</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">REPORT_ID</TableHead>
                <TableHead className="text-muted-foreground">DATE</TableHead>
                <TableHead className="text-muted-foreground">TYPE</TableHead>
                <TableHead className="text-muted-foreground">SEVERITY</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-mono text-primary">{report.id}</TableCell>
                  <TableCell className="font-mono">{report.date}</TableCell>
                  <TableCell className="font-mono">{report.type}</TableCell>
                  <TableCell>
                    <span className={
                      report.severity === "High" ? "text-destructive" : 
                      report.severity === "Medium" ? "text-yellow-500" : 
                      "text-primary"
                    }>
                      {report.severity}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
