"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Radar, Globe, Calendar, Database } from "lucide-react"
import { toast } from "sonner"

export default function AssetDiscovery() {
  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [assets, setAssets] = useState<any[]>([])

  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/recon')
      const data = await response.json()
      if (response.ok) setAssets(data)
    } catch (error) {
      console.error("Failed to fetch assets")
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  const handleDiscovery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!domain) return

    setLoading(true)
    try {
      const response = await fetch('/api/recon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Discovery failed')
      
      toast.success(`Discovered ${data.subdomains.length} subdomains`)
      fetchAssets()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Attack Surface Discovery</h2>
        <p className="text-muted-foreground mt-1">Map your infrastructure by discovering subdomains and associated assets.</p>
      </div>
      
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">OSINT Configuration</CardTitle>
          <CardDescription>Enter a root domain to perform deep subdomain reconnaissance.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDiscovery} className="flex gap-4">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="e.g., google.com"
                className="pl-10 h-10 bg-background"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading || !domain} className="h-10 px-8 bg-primary text-white hover:bg-primary/90">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Radar className="mr-2 h-4 w-4" />}
              Start Discovery
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Inventory List</CardTitle>
              <CardDescription>Total of {assets.length} unique assets tracked in database.</CardDescription>
            </div>
            <Database className="h-5 w-5 text-primary/40" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/40 hover:bg-transparent">
                <TableHead className="text-[11px] font-bold uppercase text-muted-foreground">Asset Domain</TableHead>
                <TableHead className="text-[11px] font-bold uppercase text-muted-foreground">Source</TableHead>
                <TableHead className="text-right text-[11px] font-bold uppercase text-muted-foreground">Last Scanned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.length > 0 ? assets.map((asset) => (
                <TableRow key={asset.id} className="border-border/40 hover:bg-primary/5 transition-colors">
                  <TableCell className="font-semibold text-primary">{asset.domain}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase border-primary/20 bg-primary/5 text-primary">
                      {asset.source}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(asset.lastSeen).toLocaleDateString()}
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-10 text-muted-foreground italic text-xs">No assets discovered yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
