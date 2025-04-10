'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { hostelService } from '@/lib/api/services/hostels';
import { RoomList } from '@/components/rooms/room-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AddRoomDialog } from '@/components/rooms/add-room-dialog';

export default function HostelRoomsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: hostel, isLoading } = useQuery({
    queryKey: ['hostel', id],
    queryFn: () => hostelService.getHostel(id)
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/admin/rooms" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Hostels
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{hostel?.name} Rooms</h1>
          <p className="text-muted-foreground">
            Manage rooms for {hostel?.name} hostel
          </p>
        </div>
        <AddRoomDialog hostelId={id} />
      </div>
      <RoomList hostelId={id} />
    </div>
  );
} 