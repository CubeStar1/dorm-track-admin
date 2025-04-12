'use client';

import { Button } from '@/components/ui/button';
import { WardenDetails } from '@/components/wardens/warden-details';
import { wardensService } from '@/lib/api/services/wardens';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { use } from 'react';

export default function WardenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = use(params);

  const { data: warden, isLoading } = useQuery({
    queryKey: ['wardens', id],
    queryFn: () => wardensService.getWarden(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => wardensService.deleteWarden(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wardens'] });
      toast.success('Warden deleted successfully');
      router.push('/admin/wardens');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!warden) {
    return <div>Warden not found</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Wardens
      </Button>

      <WardenDetails
        warden={warden}
        onEdit={() => router.push(`/admin/wardens/${id}/edit`)}
        onDelete={() => {
          if (confirm('Are you sure you want to delete this warden?')) {
            deleteMutation.mutate();
          }
        }}
      />
    </div>
  );
} 