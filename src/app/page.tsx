"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, Terminal, Activity, Lock, ArrowUpRight, BarChart3 } from "lucide-react"
import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

export default function Dashboard() {
  const [logs, setLogs] = useState<string[]>([])
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    const baseLogs = [
      "Firewall rules updated successfully.",
      "Infrastructure audit initiated",
      "Vulnerability patch deployed to cluster",
      "Backup sequence completed",
      "Connection attempt monitored: node-104",
    ]
    setLogs(baseLogs)

    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics')
        const data = await response.json()
        if (response.ok) setAnalytics(data)
      } catch (e) {}
    }
    fetchAnalytics()
  }, [])

  const stats = [
    { title: "Threats Mitigated", value: analytics?.stats.totalThreats || "0", sub: "Total Identified", icon: ShieldAlert, color: "text-primary" },
    { title: "Active Assets", value: analytics?.stats.activeAssets || "0", sub: "Mapped Nodes", icon: Activity, color: "text-primary" },
    { title: "System Vulnerabilities", value: analytics?.stats.totalVulns || "0", sub: "Unresolved Issues", icon: Terminal, color: "text-destructive" },
    { title: "Security Score", value: analytics?.stats.securityScore || "100%", sub: "Enterprise Grade", icon: Lock, color: "text-primary" },
  ]

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Security Command Center</h2>
          <p className="text-muted-foreground mt-1">Real-time infrastructure monitoring and vulnerability management.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Last Update</p>
          <p className="text-xs font-medium">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
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
        <Card className="md:col-span-4 bg-card/40 border-border/40 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Threat Mitigation Trend</CardTitle>
              <CardDescription>Security events and discovery scans over the last 7 days.</CardDescription>
            </div>
            <BarChart3 className="h-4 w-4 text-muted-foreground/40" />
          </CardHeader>
          <CardContent className="h-[300px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.chartData || []}>
                <defs>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.65 0.2 250)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="oklch(0.65 0.2 250)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  width={30}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10, 10, 20, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="threats" 
                  stroke="oklch(0.65 0.2 250)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorThreats)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="scans" 
                  stroke="rgba(255,255,255,0.2)" 
                  strokeWidth={1}
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 bg-card/40 border-border/40">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Recent Security Feed</CardTitle>
            <CardDescription>Telemetry from infrastructure monitoring.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{log}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{new Date().toLocaleDateString()} • System Event</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
