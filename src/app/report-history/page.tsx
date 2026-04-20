import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ReportHistory() {
  // Empty array as we haven't implemented a database yet
  const reports: any[] = []

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">Report_History</h2>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Archived_Audits</CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length > 0 ? (
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
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground italic font-mono text-sm">NO_AUDIT_LOGS_FOUND</p>
              <p className="text-[10px] text-muted-foreground/50 mt-2 uppercase tracking-tighter">Perform a system scan to generate report history</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
