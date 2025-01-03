'use client'

import * as React from "react"
import Link from 'next/link'
import { Stethoscope, FileText, Users, Calendar, Settings, HelpCircle, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const notesCreated = 150
  const notesLimit = 200

  return (
    <Sidebar 
      className={`
        border-r transition-all duration-300 
        bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      <SidebarHeader className="relative px-4 py-6">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white shadow-md">
            <Stethoscope className="h-6 w-6" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-blue-700 dark:text-blue-300">Scriba</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">AI Medical Scribe</span>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-8 z-10 h-6 w-6 rounded-full bg-white shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-100 dark:hover:bg-blue-900">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    {!isCollapsed && <span className="font-medium">SOAP Notes</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/patients" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-100 dark:hover:bg-blue-900">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    {!isCollapsed && <span className="font-medium">Patients</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/appointments" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-100 dark:hover:bg-blue-900">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    {!isCollapsed && <span className="font-medium">Appointments</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isCollapsed && (
          <div className="mt-6 px-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Notes Created</span>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{notesCreated}/{notesLimit}</span>
            </div>
            <Progress value={(notesCreated/notesLimit) * 100} className="h-1.5" />
          </div>
        )}

        {!isCollapsed && (
          <Button className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            New SOAP Note
          </Button>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t px-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-100 dark:hover:bg-blue-900">
                <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                {!isCollapsed && <span className="font-medium">Settings</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/help" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-100 dark:hover:bg-blue-900">
                <HelpCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                {!isCollapsed && <span className="font-medium">Help Center</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}