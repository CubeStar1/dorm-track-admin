'use client';

import { useQuery } from '@tanstack/react-query';
import { useInstitution } from '@/lib/hooks/use-institution';
import { analyticsService } from '@/lib/api/services/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Users, DoorOpen, BarChart, Home, Calendar, AlertTriangle, Wrench } from 'lucide-react';
import { OverviewCharts } from '@/components/dashboard/overview-charts';
import { MaintenanceCharts } from '@/components/dashboard/maintenance-charts';
import { ComplaintsCharts } from '@/components/dashboard/complaints-charts';
import { MessCharts } from '@/components/dashboard/mess-charts';
import { RecentMaintenance } from '@/components/dashboard/recent-maintenance';
import { RecentComplaints } from '@/components/dashboard/recent-complaints';
import { AvailableRooms } from '@/components/dashboard/available-rooms';
import { RecentEvents } from '@/components/dashboard/recent-events';
import Link from 'next/link';

export default function DashboardPage() {
  const { institutionId } = useInstitution();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', institutionId],
    queryFn: () => analyticsService.getDashboardStats(institutionId!),
    enabled: !!institutionId,
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex items-center space-x-4">
            <BarChart className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Dashboard Overview</h1>
          </div>
        </div>
      </div>

      <div className="container space-y-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Enrolled students</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Hostels</CardTitle>
              <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stats.totalHostels}</div>
              <p className="text-xs text-muted-foreground">Active hostels</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <DoorOpen className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.occupancyRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Current occupancy</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 p-1 bg-muted/20 rounded-lg gap-1">
            <TabsTrigger 
              value="overview" 
              className="border data-[state=active]:border-blue-500 data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all rounded-md hover:bg-muted/50 data-[state=inactive]:hover:border-blue-200"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="maintenance" 
              className="border data-[state=active]:border-emerald-500 data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all rounded-md hover:bg-muted/50 data-[state=inactive]:hover:border-emerald-200"
            >
              Maintenance
            </TabsTrigger>
            <TabsTrigger 
              value="complaints" 
              className="border data-[state=active]:border-orange-500 data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all rounded-md hover:bg-muted/50 data-[state=inactive]:hover:border-orange-200"
            >
              Complaints
            </TabsTrigger>
            <TabsTrigger 
              value="mess" 
              className="border data-[state=active]:border-purple-500 data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all rounded-md hover:bg-muted/50 data-[state=inactive]:hover:border-purple-200"
            >
              Mess
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="border-t-4 border-blue-500">
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/admin/hostels" className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Hostels</span>
                  </Link>
                  <Link href="/admin/rooms" className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <Home className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Rooms</span>
                  </Link>
                  <Link href="/admin/students" className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Students</span>
                  </Link>
                  <Link href="/admin/events" className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Events</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="col-span-2 border-t-4 border-blue-500">
                <CardHeader>
                  <CardTitle>Occupancy Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <OverviewCharts
                    occupancyTrend={stats.occupancyTrend}
                    roomTypeDistribution={stats.roomTypeDistribution}
                  />
                </CardContent>
              </Card>
              <AvailableRooms />
              <RecentEvents />
            </div>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <Card className="border-t-4 border-emerald-500">
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Link href="/admin/maintenance" className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <Wrench className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm">All Maintenance</span>
                  </Link>
                  <Link href="/admin/hostels" className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <Building2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm">Hostels</span>
                  </Link>
                  <Link href="/admin/rooms" className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <Home className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm">Rooms</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-2 border-t-4 border-emerald-500">
              <CardHeader>
                <CardTitle>Maintenance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <MaintenanceCharts
                  maintenanceStats={stats.maintenanceStats}
                  maintenanceByType={stats.maintenanceByType}
                />
              </CardContent>
            </Card>
            <RecentMaintenance />
          </TabsContent>

          <TabsContent value="complaints" className="space-y-6">
            <Card className="border-t-4 border-orange-500">
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Link href="/admin/complaints" className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">All Complaints</span>
                  </Link>
                  <Link href="/admin/students" className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <Users className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Students</span>
                  </Link>
                  <Link href="/admin/wardens" className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <Users className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Wardens</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-2 border-t-4 border-orange-500">
              <CardHeader>
                <CardTitle>Complaints Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ComplaintsCharts
                  complaintStats={stats.complaintStats}
                  complaintsByType={stats.complaintsByType}
                />
              </CardContent>
            </Card>
            <RecentComplaints />
          </TabsContent>

          <TabsContent value="mess" className="space-y-6">
            <Card className="border-t-4 border-purple-500">
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Link href="/admin/hostels" className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <Building2 className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Hostels</span>
                  </Link>
                  <Link href="/admin/students" className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Students</span>
                  </Link>
                  <Link href="/admin/wardens" className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Wardens</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-2 border-t-4 border-purple-500">
              <CardHeader>
                <CardTitle>Mess Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <MessCharts messRatings={stats.messRatings} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container space-y-8 py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px]" />
              <Skeleton className="mt-1 h-3 w-[80px]" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="space-y-6">
        <Skeleton className="h-10 w-[300px]" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[350px] w-full" />
          <Skeleton className="h-[350px] w-full" />
        </div>
      </div>
    </div>
  );
} 