'use client'

import Link from 'next/link'
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/app-sidebar'

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div 
        className="flex h-screen overflow-hidden"
        style={{ "--sidebar-width": "19rem" }}
      >
        <AppSidebar />
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}