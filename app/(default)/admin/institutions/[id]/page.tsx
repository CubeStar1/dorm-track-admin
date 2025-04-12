'use client';

import { InstitutionForm } from '@/components/institutions/institution-form';
import { InstitutionDetails } from '@/components/institutions/institution-details';
import { InstitutionHostels } from '@/components/institutions/institution-hostels';
import { InstitutionWardens } from '@/components/institutions/institution-wardens';
import { InstitutionStudents } from '@/components/institutions/institution-students';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Institution, institutionsService } from '@/lib/api/services/institutions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { toast } from 'sonner';

export default function InstitutionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const {id} = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: institution, isLoading } = useQuery({
    queryKey: ['institutions', id],
    queryFn: () => institutionsService.getInstitution(id),
  });

  const updateInstitutionMutation = useMutation({
    mutationFn: (data: Partial<Institution>) =>
      institutionsService.updateInstitution(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
      toast.success('Institution updated successfully');
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (data: any) => {
    updateInstitutionMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!institution) {
    return <div>Institution not found</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold">{institution.name}</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className="ml-auto"
        >
          <Edit className="mr-2 h-4 w-4" />
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      {isEditing ? (
        <div className="flex justify-center w-full">
          <div className="w-full max-w-4xl">
            <InstitutionForm
              onSubmit={handleSubmit}
              isSubmitting={updateInstitutionMutation.isPending}
              defaultValues={institution}
              submitButtonText="Update Institution"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <InstitutionDetails institution={institution} />
          <InstitutionHostels hostels={institution.hostels} />
          <InstitutionWardens hostels={institution.hostels} />
          <InstitutionStudents students={institution.students} />
        </div>
      )}
    </div>
  );
} 