"use client"

import * as React from "react"
import {
  ShieldAlert,
  Search,
  History,
  Map,
  LayoutDashboard,
  FileCode,
  Zap,
} from "lucide-react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Active Scans",
    url: "/active-scans",
    icon: Search,
  },
  {
    title: "Code Audit",
    url: "/code-audit",
    icon: FileCode,
  },
  {
    title: "Penetration Test",
    url: "/pentest",
    icon: Zap,
  },
  {
    title: "Report History",
    url: "/report-history",
    icon: History,
  },
  {
    title: "Vulnerability Map",
    url: "/vulnerability-map",
    icon: Map,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-2 font-bold text-primary">
          <ShieldAlert className="h-6 w-6" />
          <span className="group-data-[collapsible=icon]:hidden uppercase tracking-tighter">SEC_AUDIT v1.0</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground uppercase text-[10px] tracking-widest">Main Terminal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    render={<Link href={item.url} />}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
