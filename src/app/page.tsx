"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, Terminal, Activity, Lock } from "lucide-react"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    // Simulated real-time log stream
    const baseLogs = [
      "Firewall rules updated successfully.",
      "Weekly security audit initiated by user: ROOT",
      "Vulnerability patch deployed to production cluster.",
      "Backup sequence completed for DB_PRODUCTION.",
      "Unauthorized access attempt detected at node: 192.168.1.104",
    ]
    
    setLogs(baseLogs.map(log => `[${new Date().toLocaleTimeString()}] ${log}`))
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-tighter">Total Threats Blocked</CardTitle>
            <ShieldAlert className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">--</div>
            <p className="text-xs text-muted-foreground">Initializing metrics...</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-tighter">Active System Scans</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">0</div>
            <p className="text-xs text-muted-foreground">Monitoring active nodes</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-tighter">Vulnerabilities Found</CardTitle>
            <Terminal className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">--</div>
            <p className="text-xs text-muted-foreground">Scan required to update</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-tighter">Encrypted Nodes</CardTitle>
            <Lock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">100%</div>
            <p className="text-xs text-muted-foreground">Communication secure</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">System_Logs::Recent_Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 font-mono text-sm">
              {logs.length > 0 ? logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-muted-foreground whitespace-nowrap">{log.split(']')[0]}]</span>
                  <span className="text-foreground">{log.split(']')[1]}</span>
                </div>
              )) : (
                <p className="text-muted-foreground italic">Waiting for incoming logs...</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-3 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Threat_Vector_Map</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[200px]">
            <div className="w-full h-full border border-dashed border-border rounded flex items-center justify-center relative overflow-hidden bg-black/50">
               <div className="absolute inset-0 flex items-center justify-center opacity-20">
                 <div className="w-32 h-32 border-2 border-primary rounded-full animate-ping" />
                 <div className="w-16 h-16 border-2 border-primary rounded-full animate-pulse absolute" />
               </div>
               <span className="text-xs text-muted-foreground font-mono animate-pulse">SCANNING_GEOLOCATION...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
