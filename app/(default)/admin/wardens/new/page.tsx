'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WardenForm } from '@/components/wardens/warden-form';
import { wardensService } from '@/lib/api/services/wardens';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useInstitution } from '@/lib/hooks/use-institution';
import { Skeleton } from '@/components/ui/skeleton';

type Hostel = {
  id: string;
  name: string;
};

export default function NewWardenPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { institutionId, isLoading: isLoadingInstitution } = useInstitution();

  const { data: hostels, isLoading: isLoadingHostels } = useQuery<Hostel[]>({
    queryKey: ['hostels', institutionId],
    queryFn: async () => {
      if (!institutionId) throw new Error('Institution ID is required');
      const response = await fetch(`/api/hostels?institutionId=${institutionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch hostels');
      }
      return response.json();
    },
    enabled: !!institutionId,
  });

  const createMutation = useMutation({
    mutationFn: wardensService.createWarden,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wardens'] });
      toast.success('Warden created successfully');
      router.push('/admin/wardens');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: any) => {
    createMutation.mutate(values);
  };

  if (isLoadingInstitution || isLoadingHostels) {
    return (
      <div className="container mx-auto py-6 space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-[600px] max-w-3xl mx-auto" />
      </div>
    );
  }

  if (!institutionId) {
    return <div>Institution not found</div>;
  }

  if (!hostels) {
    return <div>Failed to load data</div>;
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Wardens
      </Button>

      <Card className="border-2">
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <CardTitle>Add New Warden</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <WardenForm
            onSubmit={onSubmit}
            hostels={hostels}
            isSubmitting={createMutation.isPending}
            submitButtonText="Create Warden"
          />
        </CardContent>
      </Card>
    </div>
  );
} 