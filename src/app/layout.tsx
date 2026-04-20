import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sentinel OS | Security Dashboard",
  description: "Modern enterprise-grade security monitoring and auditing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <TooltipProvider>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <main className="flex-1 flex flex-col min-w-0 bg-background/50 backdrop-blur-3xl">
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/40 px-6">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <div className="h-4 w-px bg-border/60" />
                    <p className="text-xs font-medium text-muted-foreground tracking-wide">Infrastructure / Global Overview</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">System Healthy</span>
                    </div>
                  </div>
                </header>
                <div className="flex-1 overflow-auto p-8 max-w-7xl mx-auto w-full">
                  {children}
                </div>
              </main>
            </div>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
