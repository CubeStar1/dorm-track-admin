'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hostelService } from '@/lib/api/services/hostels';
import { useInstitution } from '@/lib/hooks/use-institution';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Building2, Search, Plus, Home, Users2, Pencil } from 'lucide-react';
import { EditHostelDialog } from './edit-hostel-dialog';
import { Hostel } from '@/lib/api/services/hostels';
import { useRouter } from 'next/navigation';

export function HostelList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHostel, setSelectedHostel] = useState<Hostel | undefined>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { institutionId, isLoading: isLoadingInstitution } = useInstitution();
  const router = useRouter();

  const { data: hostels, isLoading: isLoadingHostels } = useQuery({
    queryKey: ['hostels', institutionId],
    queryFn: () => hostelService.getHostels({ institutionId }),
    enabled: !!institutionId,
    staleTime: 0,
    refetchOnMount: true
  });

  const filteredHostels = hostels?.filter(hostel => 
    hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hostel.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (hostel: Hostel, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the card's Link from activating
    setSelectedHostel(hostel);
    setIsEditDialogOpen(true);
  };

  if (isLoadingInstitution || isLoadingHostels) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Building2 className="w-8 h-8 text-muted-foreground" />
          <p className="text-muted-foreground">Loading hostels...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search hostels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 rounded-lg"
          />
        </div>
        <Button onClick={() => {
          setSelectedHostel(undefined);
          setIsEditDialogOpen(true);
        }} className="gap-2">
          <Plus className="w-4 h-4" />
          Add New Hostel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHostels?.map((hostel) => (
          <Link key={hostel.id} href={`/admin/hostels/${hostel.id}`}>
            <Card className="group hover:shadow-lg transition-all duration-300 border-t-4 border-t-primary cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {hostel.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{hostel.code}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleEditClick(hostel, e)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm">
                      <Home className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>
                        <span className="font-medium">{hostel.total_rooms}</span> Rooms
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users2 className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>
                        <span className="font-medium">{hostel.total_blocks}</span> Blocks
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredHostels?.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium">No hostels found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or add a new hostel
          </p>
        </div>
      )}

      {selectedHostel && (
        <EditHostelDialog
          hostel={selectedHostel}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={() => {
            setIsEditDialogOpen(false);
            setSelectedHostel(undefined);
            router.refresh();
          }}
        />
      )}
    </div>
  );
} 