"use client"

import * as React from "react"
import {
  ShieldCheck,
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
    title: "Overview",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Network Scan",
    url: "/active-scans",
    icon: Search,
  },
  {
    title: "Code Auditor",
    url: "/code-audit",
    icon: FileCode,
  },
  {
    title: "Security Test",
    url: "/pentest",
    icon: Zap,
  },
  {
    title: "History",
    url: "/report-history",
    icon: History,
  },
  {
    title: "Threat Map",
    url: "/vulnerability-map",
    icon: Map,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-sidebar/50 backdrop-blur-xl">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3 font-semibold text-primary tracking-tight">
          <div className="bg-primary/10 p-2 rounded-lg">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <span className="group-data-[collapsible=icon]:hidden text-lg">Sentinel OS</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-2">Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    render={<Link href={item.url} />}
                    className="h-10 px-4 rounded-lg transition-all duration-200 hover:bg-primary/5 hover:text-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.title}</span>
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
