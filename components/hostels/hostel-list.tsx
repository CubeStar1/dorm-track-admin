'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Hostel, hostelService } from '@/lib/api/services/hostels';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInstitution } from '@/lib/hooks/use-institution';
import { 
  Search, 
  Building2, 
  MapPin, 
  Users, 
  Home,
  Plus,
  Building
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function HostelList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const { institutionId, isLoading: isLoadingInstitution } = useInstitution();

  const { data: hostels, isLoading: isLoadingHostels } = useQuery({
    queryKey: ['hostels', cityFilter, stateFilter, institutionId],
    queryFn: () => hostelService.getHostels({ 
      city: cityFilter === 'all' ? undefined : cityFilter, 
      state: stateFilter === 'all' ? undefined : stateFilter,
      institutionId 
    }),
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-lg shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search hostels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 rounded-lg"
          />
        </div>
        <Select value={cityFilter} onValueChange={setCityFilter}>
          <SelectTrigger className="w-[180px] rounded-lg">
            <SelectValue placeholder="Filter by city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {Array.from(new Set(hostels?.map(h => h.city))).map(city => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger className="w-[180px] rounded-lg">
            <SelectValue placeholder="Filter by state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {Array.from(new Set(hostels?.map(h => h.state))).map(state => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button asChild className="ml-auto gap-2 rounded-lg">
          <Link href="/admin/hostels/new">
            <Plus className="w-4 h-4" />
            Add New Hostel
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHostels?.map((hostel) => (
          <Link key={hostel.id} href={`/admin/hostels/${hostel.id}`}>
            <Card className="group hover:shadow-lg transition-all duration-300 border-t-4 border-t-primary">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {hostel.name}
                    </h3>
                    <Badge variant="secondary" className="mt-1">
                      {hostel.code}
                    </Badge>
                  </div>
                  <Building2 className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2 shrink-0" />
                    <span>{hostel.city}, {hostel.state}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm">
                      <Building className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>
                        <span className="font-medium">{hostel.total_blocks}</span> Blocks
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Home className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>
                        <span className="font-medium">{hostel.total_rooms}</span> Rooms
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
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
} 