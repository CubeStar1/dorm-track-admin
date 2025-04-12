'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { roomService } from '@/lib/api/services/rooms';
import { RoomForm } from '@/components/rooms/room-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, BedDouble } from 'lucide-react';
import { use } from 'react';

export default function EditRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const { data: room, isLoading } = useQuery({
    queryKey: ['room', id],
    queryFn: () => roomService.getRoom(id),
    staleTime: 0,
    refetchOnMount: true
  });

  const handleSuccess = () => {
    router.push(`/admin/rooms/${id}`);
  };

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
        <BedDouble className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium">Room not found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          The room you're looking for doesn't exist
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="gap-2"
            asChild
          >
            <Link href={`/admin/rooms/${id}`}>
              <ArrowLeft className="w-4 h-4" />
              Back to Room Details
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Edit Room {room.room_number}
          </h1>
          <p className="text-gray-500 mt-2">
            Update room information and settings
          </p>
        </div>

        <RoomForm 
          room={room} 
          hostelId={room.hostel_id}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
} 