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
  title: "Security Audit Dashboard",
  description: "Professional hacker-style security monitoring dashboard",
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
              <main className="flex-1 flex flex-col min-w-0">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
                  <SidebarTrigger />
                  <div className="h-4 w-px bg-border mx-2" />
                  <h1 className="text-sm font-semibold text-primary uppercase tracking-widest">
                    System_Access::Authorized
                  </h1>
                </header>
                <div className="flex-1 overflow-auto p-6">
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
