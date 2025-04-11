'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LayoutGridIcon, TableIcon, PlusIcon } from 'lucide-react';
import { EventCard } from '@/components/events/event-card';
import { EventsTable } from '@/components/events/events-table';
import CustomButton from '@/components/ui/custom-button';
import { eventsService } from '@/lib/api/services/events';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

export default function EventsPage() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const router = useRouter();

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventsService.getEvents(),
  });

  return (
    <div className="h-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Events Management</h1>
          <p className="text-gray-600">Create and manage institution events</p>
        </div>
        <div className="flex items-center gap-3">
          <CustomButton
            onClick={() => router.push('/admin/events/new')}
            variant="primary"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Event
          </CustomButton>
          <CustomButton
            onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
            variant={viewMode === 'table' ? 'outline' : 'primary'}
          >
            {viewMode === 'table' ? (
              <>
                <LayoutGridIcon className="w-4 h-4 mr-2" />
                Grid View
              </>
            ) : (
              <>
                <TableIcon className="w-4 h-4 mr-2" />
                Table View
              </>
            )}
          </CustomButton>
        </div>
      </div>

      <div className="h-[calc(100%-5rem)] overflow-y-auto pr-2">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-xl aspect-[4/3] animate-pulse"
              />
            ))}
          </div>
        ) : viewMode === 'table' ? (
          <EventsTable events={events || []} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events?.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
            {events?.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border">
                <p className="text-gray-500">No events found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 