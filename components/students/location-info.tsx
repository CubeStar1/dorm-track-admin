import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, DoorOpen, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { Student } from '@/lib/api/services/students';
import { useRouter } from 'next/navigation';

export function LocationInfo({ student }: { student: Student }) {
  const router = useRouter();

  const hostel = student.hostel;
  const room = student.room;

  return (
    <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950 border-2 border-teal-200 dark:border-teal-800">
      <CardHeader className="border-b border-teal-200 dark:border-teal-800">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          <CardTitle className="text-teal-900 dark:text-teal-100">Location Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400">
                <Building2 className="h-4 w-4" />
                <span>Hostel</span>
              </div>
              {hostel?.id && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                  onClick={() => router.push(`/admin/hostels/${hostel.id}`)}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Hostel
                </Button>
              )}
            </div>
            <div className="rounded-md p-2 -mx-2">
              <p className="text-lg font-medium text-teal-900 dark:text-teal-100">
                {hostel?.name || 'Not allocated'}
              </p>
              {hostel && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400">
                    <Building2 className="h-4 w-4" />
                    <span>Code: {hostel.code}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400">
                    <MapPin className="h-4 w-4" />
                    <span>{hostel.address}, {hostel.city}, {hostel.state}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400">
                    <Phone className="h-4 w-4" />
                    <span>{hostel.contact_phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400">
                    <Mail className="h-4 w-4" />
                    <span>{hostel.contact_email}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-teal-50 dark:bg-teal-900/20 p-2 rounded-md">
                      <p className="text-xs text-teal-600 dark:text-teal-400">Total Blocks</p>
                      <p className="text-lg font-medium text-teal-900 dark:text-teal-100">
                        {hostel.total_blocks}
                      </p>
                    </div>
                    <div className="bg-teal-50 dark:bg-teal-900/20 p-2 rounded-md">
                      <p className="text-xs text-teal-600 dark:text-teal-400">Total Rooms</p>
                      <p className="text-lg font-medium text-teal-900 dark:text-teal-100">
                        {hostel.total_rooms}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {room && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400">
                  <DoorOpen className="h-4 w-4" />
                  <span>Room</span>
                </div>
                {room.id && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                    onClick={() => router.push(`/admin/rooms/${room.id}`)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Room
                  </Button>
                )}
              </div>
              <div className="rounded-md p-2 -mx-2">
                <p className="text-lg font-medium text-teal-900 dark:text-teal-100">
                  Block {room.block} - Room {room.room_number}
                </p>
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-teal-50 dark:bg-teal-900/20 p-2 rounded-md">
                      <p className="text-xs text-teal-600 dark:text-teal-400">Floor</p>
                      <p className="text-lg font-medium text-teal-900 dark:text-teal-100">
                        {room.floor}
                      </p>
                    </div>
                    <div className="bg-teal-50 dark:bg-teal-900/20 p-2 rounded-md">
                      <p className="text-xs text-teal-600 dark:text-teal-400">Type</p>
                      <p className="text-lg font-medium text-teal-900 dark:text-teal-100">
                        {room.room_type}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-teal-50 dark:bg-teal-900/20 p-2 rounded-md">
                      <p className="text-xs text-teal-600 dark:text-teal-400">Capacity</p>
                      <p className="text-lg font-medium text-teal-900 dark:text-teal-100">
                        {room.capacity}
                      </p>
                    </div>
                    <div className="bg-teal-50 dark:bg-teal-900/20 p-2 rounded-md">
                      <p className="text-xs text-teal-600 dark:text-teal-400">Occupancy</p>
                      <p className="text-lg font-medium text-teal-900 dark:text-teal-100">
                        {room.current_occupancy}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-teal-50 dark:bg-teal-900/20 p-2 rounded-md">
                      <p className="text-xs text-teal-600 dark:text-teal-400">Status</p>
                      <p className="text-lg font-medium text-teal-900 dark:text-teal-100">
                        {room.status}
                      </p>
                    </div>
                    <div className="bg-teal-50 dark:bg-teal-900/20 p-2 rounded-md">
                      <p className="text-xs text-teal-600 dark:text-teal-400">Price</p>
                      <p className="text-lg font-medium text-teal-900 dark:text-teal-100">
                        ₹{room.price}
                      </p>
                    </div>
                  </div>
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="bg-teal-50 dark:bg-teal-900/20 p-2 rounded-md">
                      <p className="text-xs text-teal-600 dark:text-teal-400">Amenities</p>
                      <p className="text-sm text-teal-900 dark:text-teal-100">
                        {room.amenities.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 