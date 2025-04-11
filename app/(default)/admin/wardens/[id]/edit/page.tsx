'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WardenForm } from '@/components/wardens/warden-form';
import { Warden, UpdateWardenData, wardensService } from '@/lib/api/services/wardens';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, UserCog } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import * as z from 'zod';
import { useInstitution } from '@/lib/hooks/use-institution';
import { Skeleton } from '@/components/ui/skeleton';

type Hostel = {
  id: string;
  name: string;
};

const formSchema = z.object({
  user: z.object({
    full_name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().nullish(),
    gender: z.string().nullish(),
  }),
  employee_id: z.string().min(1, 'Employee ID is required'),
  hostel_id: z.string().min(1, 'Hostel is required'),
  assigned_blocks: z.array(z.string()).min(1, 'At least one block must be assigned'),
});

type FormData = z.infer<typeof formSchema>;

export default function EditWardenPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { institutionId, isLoading: isLoadingInstitution } = useInstitution();

  const { data: warden, isLoading: isLoadingWarden } = useQuery<Warden>({
    queryKey: ['wardens', params.id],
    queryFn: () => wardensService.getWarden(params.id),
  });

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

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => {
      const updateData: UpdateWardenData = {
        user: {
          full_name: data.user.full_name,
          email: data.user.email,
          phone: data.user.phone || undefined,
          gender: data.user.gender || undefined,
        },
        employee_id: data.employee_id,
        hostel_id: data.hostel_id,
        assigned_blocks: data.assigned_blocks,
      };
      return wardensService.updateWarden(params.id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wardens'] });
      toast.success('Warden updated successfully');
      router.push(`/admin/wardens/${params.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: FormData) => {
    updateMutation.mutate(values);
  };

  if (isLoadingInstitution || isLoadingWarden || isLoadingHostels) {
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

  if (!warden || !hostels) {
    return <div>Failed to load data</div>;
  }

  const defaultValues: FormData = {
    user: {
      full_name: warden.user.full_name,
      email: warden.user.email,
      phone: warden.user.phone || undefined,
      gender: warden.user.gender || undefined,
    },
    employee_id: warden.employee_id,
    hostel_id: warden.hostel_id,
    assigned_blocks: warden.assigned_blocks,
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Warden Details
      </Button>

      <Card className="border-2">
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-primary" />
            <CardTitle>Edit Warden</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <WardenForm
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            hostels={hostels}
            isSubmitting={updateMutation.isPending}
            submitButtonText="Update Warden"
          />
        </CardContent>
      </Card>
    </div>
  );
} 