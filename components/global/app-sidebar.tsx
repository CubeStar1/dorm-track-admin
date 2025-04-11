"use client"

import { 
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  User,
  AlertTriangle,
  School,
  Home,
  Calendar,
  Wrench
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { NavProfile } from "@/components/navigation/nav-profile"
import useUser from "@/hooks/use-user"

const navigationGroups = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        description: "Overview of your hostel life",
      },
    ]
  },
  {
    label: "Hostel Management",
    items: [
      {
        title: "Hostels",
        href: "/admin/hostels",
        icon: Building2,
        description: "View and manage hostels",
      },
      {
        title: "Rooms",
        href: "/admin/rooms",
        icon: Home,
        description: "Room management",
      },
      {
        title: "Complaints",
        href: "/admin/complaints",
        icon: AlertTriangle,
        description: "View and manage complaints",
      },
      {
        title: "Maintenance",
        href: "/admin/maintenance",
        icon: Wrench,
        description: "View and manage maintenance requests",
      },  
      {
        title: "Events",
        href: "/admin/events",
        icon: Calendar,
        description: "View and manage events",
      },
    ]
  },
  {
    label: "User Management",
    items: [
      {
        title: "Institutions",
        href: "/admin/institutions",
        icon: School,
        description: "Manage institution records",
      },
      {
        title: "Students",
        href: "/admin/students",
        icon: School,
        description: "Manage student records",
      },
      {
        title: "Wardens",
        href: "/admin/wardens",
        icon: Users,
        description: "Manage warden records",
      },
    ]
  },
  {
    label: "Account",
    items: [
      {
        title: "Profile",
        href: "/admin/profile",
        icon: User,
        description: "Manage your profile",
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        description: "Account settings",
      },
    ]
  }
]

export function AppSidebar() {
  const { data: user } = useUser()

  return (
    <Sidebar className="">
      <SidebarHeader>
        <div className="relative border-b border-border/10 bg-gradient-to-br from-background/90 via-background/50 to-background/90 px-6 py-5 backdrop-blur-xl">
          <Link href="/" className="relative flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 shadow-lg ring-2 ring-blue-500/20 dark:from-blue-500 dark:via-indigo-500 dark:to-violet-500">
              <Building2 className="h-5 w-5 text-white shadow-sm" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                DormTrack
              </h1>
              <p className="text-sm text-muted-foreground">
                Admin Portal
              </p>
            </div>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-gradient-to-b from-background/80 to-background/20 dark:from-background/60 dark:to-background/0">
        <div className="space-y-6 py-4">
          {navigationGroups.map((group, index) => (
            <div key={index} className="px-3 py-2">
              <h2 className="mb-2 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {group.label}
              </h2>
              <div className="space-y-1">
                {group.items.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SidebarContent>
      <SidebarRail className="" />
      <SidebarFooter className="border-t border-border/20 bg-gradient-to-t from-background/90 to-background/40 px-6 py-3 backdrop-blur-xl dark:from-background/80 dark:to-background/20">
        <NavProfile user={user} />
      </SidebarFooter>
    </Sidebar>
  );
} 