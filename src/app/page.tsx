"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, Terminal, Activity, Lock, ArrowUpRight } from "lucide-react"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const baseLogs = [
      "Firewall rules updated successfully.",
      "Infrastructure audit initiated",
      "Vulnerability patch deployed to cluster",
      "Backup sequence completed",
      "Connection attempt monitored: node-104",
    ]
    setLogs(baseLogs)
  }, [])

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Security Command Center</h2>
        <p className="text-muted-foreground mt-1">Real-time infrastructure monitoring and vulnerability management.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Threats Mitigated", value: "0", sub: "Last 24 hours", icon: ShieldAlert, color: "text-primary" },
          { title: "Active Nodes", value: "1", sub: "Localhost", icon: Activity, color: "text-primary" },
          { title: "Vulns Found", value: "0", sub: "Total project", icon: Terminal, color: "text-destructive" },
          { title: "Security Score", value: "100%", sub: "Enterprise Grade", icon: Lock, color: "text-primary" },
        ].map((stat, i) => (
          <Card key={i} className="bg-card/50 border-border/50 shadow-sm transition-all hover:border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
              <p className="text-[10px] text-muted-foreground font-medium mt-1 flex items-center gap-1">
                {stat.sub} <ArrowUpRight className="h-2 w-2" />
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4 bg-card/40 border-border/40">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Recent Activity Feed</CardTitle>
            <CardDescription>Live telemetry from infrastructure nodes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {logs.length > 0 ? logs.map((log, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{log}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{new Date().toLocaleDateString()} • System Event</p>
                  </div>
                </div>
              )) : (
                <div className="h-20 flex items-center justify-center border border-dashed rounded-xl">
                  <p className="text-xs text-muted-foreground italic">Awaiting telemetry data...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3 bg-card/40 border-border/40">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Threat Surface Map</CardTitle>
            <CardDescription>Visualizing infrastructure vulnerabilities.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center relative bg-muted/20 rounded-xl border border-border/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent" />
            <div className="relative text-center">
              <div className="w-32 h-32 border-2 border-primary/20 rounded-full animate-ping absolute -inset-0 m-auto" />
              <div className="w-16 h-16 border-2 border-primary/40 rounded-full animate-pulse relative z-10 mx-auto" />
              <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-6 relative z-10">Monitoring Nodes</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
