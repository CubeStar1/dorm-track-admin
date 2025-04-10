"use client"

import { 
  LayoutDashboard,
  BedDouble,
  Building2,
  Wrench,
  UtensilsCrossed,
  Calendar,
  Users,
  Settings,
  Shirt,
  ShoppingBag,
  Bell,
  User,
  AlertTriangle
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavSection } from "@/components/navigation/nav-section"
import Link from "next/link"
import { NavProfile } from "@/components/navigation/nav-profile";
import useUser from "@/hooks/use-user"
const USER_ROLES = {
  STUDENT: 'student',
  WARDEN: 'warden',
  ADMIN: 'admin'
} as const;

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

const isWarden = (role: UserRole): role is typeof USER_ROLES.WARDEN => 
  role === USER_ROLES.WARDEN;

const isAdmin = (role: UserRole): role is typeof USER_ROLES.ADMIN => 
  role === USER_ROLES.ADMIN;


const adminNavigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of your hostel life",
  },
  {
    title: "Hostels",
    href: "/hostels",
    icon: Building2,
    description: "View all hostels",
  },
  {
    title: "Rooms",
    href: "/rooms",
    icon: Building2,
    description: "View all rooms",
  },

]

const wardenNavigationItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "Hostel management overview",
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: Users,
    description: "Manage student records",
  },
  {
    title: "Rooms",
    href: "/admin/rooms",
    icon: Building2,
    description: "Room management",
  },
  {
    title: "Maintenance",
    href: "/admin/maintenance",
    icon: Wrench,
    description: "Maintenance request management",
  },
  {
    title: "Complaints",
    href: "/admin/complaints",
    icon: AlertTriangle,
    description: "Complaint management",
  },
  {
    title: "Mess Management",
    href: "/admin/mess",
    icon: UtensilsCrossed,
    description: "Manage mess menu and feedback",
  },
  {
    title: "Events",
    href: "/admin/events",
    icon: Calendar,
    description: "Manage hostel events",
  },
  {
    title: "Announcements",
    href: "/admin/announcements",
    icon: Bell,
    description: "Post announcements",
  },
]

const settingsItems = [
  {
    title: "Profile",
    href: "/profile",
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

export function AppSidebar() {
  // TODO: Get user role from auth context
  const userRole: UserRole = USER_ROLES.ADMIN;
  const {data: user} = useUser()

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
                {isAdmin(userRole) ? 'Admin Portal' : 'Student Portal'}
              </p>
            </div>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-gradient-to-b from-background/80 to-background/20 dark:from-background/60 dark:to-background/0">
        <div className="space-y-4 py-4">
          <NavSection 
            label="Navigation"
            items={isAdmin(userRole) ? adminNavigationItems : isWarden(userRole) ? wardenNavigationItems : []}
          />
          <NavSection 
            label="Account"
            items={settingsItems}
          />
        </div>
      </SidebarContent>
      <SidebarRail className="" />
      <SidebarFooter className="border-t border-border/20 bg-gradient-to-t from-background/90 to-background/40 px-6 py-3 backdrop-blur-xl dark:from-background/80 dark:to-background/20">
        <NavProfile user={user} />
      </SidebarFooter>
    </Sidebar>
  );
} 