'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { roomService } from '@/lib/api/services/rooms';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  BedDouble, 
  Users, 
  CheckCircle, 
  XCircle,
  Pencil,
  Home,
  Mail,
  Phone
} from 'lucide-react';
import Image from 'next/image';

export default function RoomDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  const { data: room, isLoading } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => roomService.getRoom(roomId)
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

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Images */}
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  {room.images?.[0] ? (
                    <Image
                      src={room.images[0]}
                      alt={`Room ${room.room_number}`}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-t-lg">
                      <BedDouble className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                {room.images && room.images.length > 1 && (
                  <div className="p-4 grid grid-cols-4 gap-2">
                    {room.images.slice(1).map((image, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={image}
                          alt={`Room ${room.room_number} view ${index + 2}`}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Room Details */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-1">Room {room.room_number}</h1>
                    <p className="text-gray-500">Block {room.block}</p>
                  </div>
                  <Button onClick={() => router.push(`/admin/rooms/${roomId}/edit`)} className="gap-2">
                    <Pencil className="w-4 h-4" />
                    Edit Room
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {room.status === 'available' ? (
                      <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-sm font-medium">
                        <XCircle className="w-4 h-4" />
                        {room.status === 'maintenance' ? 'Maintenance' : 'Occupied'}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600">{room.description}</p>

                  {/* Room Info */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y">
                    <div className="flex items-center gap-2 text-gray-600">
                      <BedDouble className="w-5 h-5" />
                      <div>
                        <p className="text-sm font-medium">Room Type</p>
                        <p className="text-sm">{room.room_type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-5 h-5" />
                      <div>
                        <p className="text-sm font-medium">Occupancy</p>
                        <p className="text-sm">{room.current_occupancy}/{room.capacity}</p>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  {room.amenities && room.amenities.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Current Occupants */}
                  {room.allocations && room.allocations.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Current Occupants</h3>
                      <div className="space-y-4">
                        {room.allocations.map((allocation) => (
                          <Card key={allocation.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium">{allocation.student.user.full_name}</h4>
                                  <p className="text-sm text-gray-500">ID: {allocation.student.student_id}</p>
                                </div>
                                <div className="text-sm text-gray-500">
                                  Since: {new Date(allocation.start_date).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="mt-2 space-y-1 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  <span>{allocation.student.user.email}</span>
                                </div>
                                {allocation.student.user.phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    <span>{allocation.student.user.phone}</span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-1">₹{room.price.toLocaleString()}</h3>
                <p className="text-gray-500 mb-4">per semester</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-4 h-4" />
                    <span>{room.hostel?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{room.hostel?.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

