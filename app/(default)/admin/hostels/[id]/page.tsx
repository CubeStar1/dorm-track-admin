'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { use } from 'react';
import { hostelService } from '@/lib/api/services/hostels';
import { useInstitution } from '@/lib/hooks/use-institution';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RoomList } from '@/components/rooms/room-list';
import { EditHostelDialog } from '@/components/hostels/edit-hostel-dialog';
import { Building2, MapPin, Mail, Phone, Users2, Home, Pencil, UtensilsCrossed } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HostelDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const { institutionId, isLoading: isLoadingInstitution } = useInstitution();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();

  const { data: hostel, isLoading: isLoadingHostel } = useQuery({
    queryKey: ['hostel', id],
    queryFn: () => hostelService.getHostel(id),
    staleTime: 0, // Consider data stale immediately
    refetchOnMount: true // Refetch when component mounts
  });

  const handleEditSuccess = () => {
    // Invalidate both the individual hostel and the hostels list queries
    queryClient.invalidateQueries({ queryKey: ['hostel', id] });
    queryClient.invalidateQueries({ queryKey: ['hostels'] });
    setIsEditDialogOpen(false);
  };

  if (isLoadingHostel || isLoadingInstitution) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Building2 className="w-8 h-8 text-muted-foreground" />
          <p className="text-muted-foreground">Loading hostel details...</p>
        </div>
      </div>
    );
  }

  if (!hostel || !institutionId) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium">Hostel not found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          The hostel you're looking for doesn't exist
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{hostel.name}</h1>
            <p className="text-gray-500 mt-2">Manage hostel details and rooms</p>
          </div>
          <Button onClick={() => setIsEditDialogOpen(true)} className="gap-2">
            <Pencil className="w-4 h-4" />
            Edit Hostel
          </Button>
        </div>

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Hostel Details</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="mess-menu">Mess Menu</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="w-5 h-5" />
                      <div>
                        <p className="text-sm font-medium">Code</p>
                        <p>{hostel.code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <div>
                        <p className="text-sm font-medium">Address</p>
                        <p>{hostel.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-5 h-5" />
                      <div>
                        <p className="text-sm font-medium">Contact Email</p>
                        <p>{hostel.contact_email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-5 h-5" />
                      <div>
                        <p className="text-sm font-medium">Contact Phone</p>
                        <p>{hostel.contact_phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Home className="w-5 h-5" />
                      <div>
                        <p className="text-sm font-medium">Total Rooms</p>
                        <p>{hostel.total_rooms}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users2 className="w-5 h-5" />
                      <div>
                        <p className="text-sm font-medium">Total Blocks</p>
                        <p>{hostel.total_blocks}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rooms">
            <RoomList hostelId={id} />
          </TabsContent>

          <TabsContent value="mess-menu">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Mess Menu</h2>
                  <p className="text-sm text-muted-foreground">Manage the hostel's mess menu</p>
                </div>
                <Button className="gap-2" onClick={() => router.push(`/admin/hostels/${id}/mess-menu`)}>
                  <UtensilsCrossed className="w-4 h-4" />
                  Manage Menu
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Click the button above to manage the mess menu for this hostel.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <EditHostelDialog
          hostel={hostel}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleEditSuccess}
        />
      </div>
    </div>
  );
} 