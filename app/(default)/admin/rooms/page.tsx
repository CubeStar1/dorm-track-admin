'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hostelService } from '@/lib/api/services/hostels';
import { useInstitution } from '@/lib/hooks/use-institution';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Building2, Search, Plus, Home, Users2 } from 'lucide-react';

export default function RoomsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { institutionId, isLoading: isLoadingInstitution } = useInstitution();

  const { data: hostels, isLoading: isLoadingHostels } = useQuery({
    queryKey: ['hostels', institutionId],
    queryFn: () => hostelService.getHostels({ institutionId }),
    enabled: !!institutionId
  });

  const filteredHostels = hostels?.filter(hostel => 
    hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hostel.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manage Rooms</h1>
            <p className="text-gray-500 mt-2">Select a hostel to view and manage its rooms</p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/admin/rooms/new">
              <Plus className="w-4 h-4" />
              Add New Room
            </Link>
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search hostels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHostels?.map((hostel) => (
            <Link key={hostel.id} href={`/admin/rooms/hostel/${hostel.id}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 border-t-4 border-t-primary cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {hostel.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{hostel.code}</p>
                    </div>
                    <Building2 className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
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
              Try adjusting your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 