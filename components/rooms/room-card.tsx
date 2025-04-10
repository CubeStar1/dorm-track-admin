'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Room } from '@/lib/api/services/rooms';
import { BedDouble, CheckCircle, XCircle, Building2, MapPin, Users } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  hostelId: string;
}

export function RoomCard({ room, hostelId }: RoomCardProps) {
  return (
    <Link href={`/admin/rooms/${room.id}`}>
      <div className="group bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-[4/3]">
          {room.images?.[0] ? (
            <Image
              src={room.images[0]}
              alt={`Room ${room.room_number}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <BedDouble className="w-12 h-12 text-gray-400" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            {room.status === 'available' ? (
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                <CheckCircle className="w-3 h-3" />
                Available
              </span>
            ) : room.status === 'maintenance' ? (
              <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                <Building2 className="w-3 h-3" />
                Maintenance
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                <XCircle className="w-3 h-3" />
                Occupied
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Room {room.room_number}</h3>
            <p className="text-sm text-gray-500">Block {room.block}</p>
          </div>

          <div className="flex flex-col gap-1 mb-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>Floor {room.floor}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Block {room.block}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <Users className="w-4 h-4" />
            <span className="text-sm">{room.room_type} ({room.current_occupancy}/{room.capacity})</span>
          </div>

          {room.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {room.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                >
                  {amenity}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">₹{room.price.toLocaleString()}</p>
            <p className="text-sm text-gray-500">per semester</p>
          </div>
        </div>
      </div>
    </Link>
  );
} 