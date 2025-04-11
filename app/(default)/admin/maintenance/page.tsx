'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LayoutGridIcon, TableIcon } from 'lucide-react';
import { MaintenanceCard } from '@/components/maintenance/maintenance-card';
import { MaintenanceTable } from '@/components/maintenance/maintenance-table';
import CustomButton from '@/components/ui/custom-button';
import { maintenanceService } from '@/lib/api/services/maintenance';
import { Skeleton } from '@/components/ui/skeleton';

export default function MaintenancePage() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const { data: requests, isLoading } = useQuery({
    queryKey: ['maintenance'],
    queryFn: () => maintenanceService.getRequests(),
  });

  return (
    <div className="h-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Maintenance Requests</h1>
          <p className="text-gray-600">View and manage maintenance requests</p>
        </div>
        <div className="flex items-center gap-3">
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
          <MaintenanceTable requests={requests || []} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {requests?.map((request) => (
              <MaintenanceCard key={request.id} request={request} />
            ))}
            {requests?.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border">
                <p className="text-gray-500">No maintenance requests found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 