'use client';

import { Button } from '@/components/ui/button';
import { WardenList } from '@/components/wardens/warden-list';
import { wardensService } from '@/lib/api/services/wardens';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WardensPage() {
  const router = useRouter();

  const { data: wardens, isLoading } = useQuery({
    queryKey: ['wardens'],
    queryFn: wardensService.getWardens,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Wardens</h1>
        <Button onClick={() => router.push('/admin/wardens/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Warden
        </Button>
      </div>

      {wardens && <WardenList wardens={wardens} />}
    </div>
  );
} 