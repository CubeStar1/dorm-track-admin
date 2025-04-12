'use client';

import { useQuery } from '@tanstack/react-query';
import { use } from 'react';
import { roomService } from '@/lib/api/services/rooms';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, BedDouble, Home } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoomDetails } from '@/components/rooms/room-details';
import { MaintenanceRequests } from '@/components/rooms/maintenance-requests';
import { Complaints } from '@/components/rooms/complaints';

export default function RoomDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: room, isLoading } = useQuery({
    queryKey: ['room', id],
    queryFn: () => roomService.getRoom(id)
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <BedDouble className="w-8 h-8 text-muted-foreground" />
          <p className="text-muted-foreground">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="text-center py-12">
        <Home className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium">Room not found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          The room you're looking for doesn't exist
        </p>
      </div>
    );
  }

  const maintenanceCount = room.maintenance_requests?.length ?? 0;
  const complaintsCount = room.complaints?.length ?? 0;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="gap-2"
          asChild
        >
          <Link href={`/admin/rooms/hostel/${room.hostel_id}`}>
            <ArrowLeft className="w-4 h-4" />
            Back to Rooms
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Room Details</TabsTrigger>
              <TabsTrigger value="maintenance">
                Maintenance Requests
                {maintenanceCount > 0 && (
                  <span className="ml-2 bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                    {maintenanceCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="complaints">
                Complaints
                {complaintsCount > 0 && (
                  <span className="ml-2 bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                    {complaintsCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <RoomDetails room={room} />
            </TabsContent>

            <TabsContent value="maintenance" className="mt-6">
              <MaintenanceRequests requests={room.maintenance_requests || []} />
            </TabsContent>

            <TabsContent value="complaints" className="mt-6">
              <Complaints complaints={room.complaints || []} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Price and Hostel Info Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-6 lg:h-fit">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-2xl font-bold">₹{room.price.toLocaleString()}</h3>
            <p className="text-muted-foreground mb-6">per semester</p>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BedDouble className="w-4 h-4" />
                <span>{room.hostel.name}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Home className="w-4 h-4" />
                <span>{room.hostel.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

