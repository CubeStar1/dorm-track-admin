'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { hostelService } from '@/lib/api/services/hostels';
import { HostelForm } from '@/components/hostels/hostel-form';
import { useInstitution } from '@/lib/hooks/use-institution';

export default function EditHostelPage() {
  const params = useParams();
  const hostelId = params.id as string;
  const { institutionId, isLoading: isLoadingInstitution } = useInstitution();

  const { data: hostel, isLoading: isLoadingHostel } = useQuery({
    queryKey: ['hostel', hostelId],
    queryFn: () => hostelService.getHostel(hostelId),
    enabled: hostelId !== 'new'
  });

  if ((hostelId !== 'new' && isLoadingHostel) || isLoadingInstitution) {
    return <div>Loading...</div>;
  }

  if (!institutionId) {
    return <div>Error: Institution not found</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {hostelId === 'new' ? 'Add New Hostel' : 'Edit Hostel'}
          </h1>
          <p className="text-gray-500 mt-2">
            {hostelId === 'new' 
              ? 'Create a new hostel in your institution' 
              : 'Update hostel information'}
          </p>
        </div>
        <HostelForm 
          hostel={hostel} 
          institutionId={institutionId}
        />
      </div>
    </div>
  );
} 