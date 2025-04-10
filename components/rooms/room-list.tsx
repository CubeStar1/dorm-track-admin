'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Room, RoomFilters, roomService } from '@/lib/api/services/rooms';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInstitution } from '@/lib/hooks/use-institution';
import { Search, BedDouble } from 'lucide-react';
import { RoomCard } from './room-card';

interface RoomListProps {
  hostelId?: string;
}

export function RoomList({ hostelId }: RoomListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<RoomFilters>({
    hostelId,
    status: undefined,
    roomType: undefined
  });
  const { institutionId, isLoading: isLoadingInstitution } = useInstitution();

  const { data: rooms, isLoading: isLoadingRooms } = useQuery({
    queryKey: ['rooms', filters, institutionId],
    queryFn: () => roomService.getRooms({ ...filters, institutionId }),
    enabled: !!institutionId
  });

  const filteredRooms = rooms?.filter(room => 
    room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.block.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoadingInstitution || isLoadingRooms) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading rooms...</p>
        </div>
      </div>
    );
  }

  if (!filteredRooms?.length) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <BedDouble className="w-12 h-12 text-muted-foreground" />
        <h3 className="text-lg font-medium">No rooms found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          {searchTerm || filters.status || filters.roomType
            ? "Try adjusting your search or filters"
            : "No rooms have been added yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 rounded-lg"
          />
        </div>
        <Select 
          value={filters.status || 'all'} 
          onValueChange={(value: Room['status'] | 'all') => 
            setFilters(prev => ({ 
              ...prev, 
              status: value === 'all' ? undefined : value 
            }))
          }
        >
          <SelectTrigger className="w-[180px] rounded-lg">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.roomType || 'all'}
          onValueChange={(value: Room['room_type'] | 'all') => 
            setFilters(prev => ({ 
              ...prev, 
              roomType: value === 'all' ? undefined : value 
            }))
          }
        >
          <SelectTrigger className="w-[180px] rounded-lg">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Single">Single</SelectItem>
            <SelectItem value="Double">Double</SelectItem>
            <SelectItem value="Triple">Triple</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} hostelId={hostelId || room.hostel_id} />
        ))}
      </div>
    </div>
  );
} 