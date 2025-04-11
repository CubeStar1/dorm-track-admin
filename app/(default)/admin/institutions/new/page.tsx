'use client';

import { InstitutionForm } from '@/components/institutions/institution-form';
import { institutionsService } from '@/lib/api/services/institutions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function NewInstitutionPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createInstitutionMutation = useMutation({
    mutationFn: institutionsService.createInstitution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
      toast.success('Institution created successfully');
      router.push('/admin/institutions');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (data: any) => {
    createInstitutionMutation.mutate(data);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold">Create Institution</h1>
      </div>

      <div className="max-w-2xl">
        <InstitutionForm
          onSubmit={handleSubmit}
          isSubmitting={createInstitutionMutation.isPending}
        />
      </div>
    </div>
  );
} 