import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hostel } from '@/lib/api/services/institutions';
import { Home } from 'lucide-react';

interface InstitutionHostelsProps {
  hostels: Hostel[];
}

export function InstitutionHostels({ hostels }: InstitutionHostelsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Home className="h-5 w-5" />
        Hostels
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hostels.map((hostel) => (
          <Card key={hostel.id}>
            <CardHeader>
              <CardTitle className="text-lg">{hostel.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Blocks</p>
                <p className="font-medium">{hostel.total_blocks}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Rooms</p>
                <p className="font-medium">{hostel.total_rooms}</p>
              </div>
              
              {/* Rooms Summary */}
              <div>
                <p className="text-sm font-semibold mb-2">Rooms Status</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Available Rooms</p>
                    <p className="font-medium">
                      {hostel.rooms.filter(room => room.status === 'available').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Occupancy</p>
                    <p className="font-medium">
                      {hostel.rooms.reduce((sum, room) => sum + room.current_occupancy, 0)} / 
                      {hostel.rooms.reduce((sum, room) => sum + room.capacity, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 