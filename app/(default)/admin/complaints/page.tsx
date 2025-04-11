'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LayoutGridIcon, TableIcon } from 'lucide-react';
import { ComplaintCard } from '@/components/complaints/complaint-card';
import { ComplaintsTable } from '@/components/complaints/complaints-table';
import CustomButton from '@/components/ui/custom-button';
import { complaintsService } from '@/lib/api/services/complaints';
import { Skeleton } from '@/components/ui/skeleton';

export default function ComplaintsPage() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const { data: complaints, isLoading } = useQuery({
    queryKey: ['complaints'],
    queryFn: () => complaintsService.getComplaints(),
  });

  return (
    <div className="h-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Complaints Management</h1>
          <p className="text-gray-600">View and manage student complaints</p>
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
          <ComplaintsTable complaints={complaints || []} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {complaints?.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
            {complaints?.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border">
                <p className="text-gray-500">No complaints found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 