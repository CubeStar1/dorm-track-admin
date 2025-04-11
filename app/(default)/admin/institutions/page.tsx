'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Institution, institutionsService } from '@/lib/api/services/institutions';
import { useQuery } from '@tanstack/react-query';
import { Building2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function InstitutionsPage() {
  const router = useRouter();

  const { data: myInstitution, isLoading: isLoadingMyInstitution } = useQuery({
    queryKey: ['my-institution'],
    queryFn: institutionsService.getMyInstitution,
  });

  const { data: institutions, isLoading: isLoadingInstitutions } = useQuery({
    queryKey: ['institutions'],
    queryFn: institutionsService.getInstitutions,
    enabled: !myInstitution, // Only fetch all institutions if user doesn't have one
  });

  const handleCreateInstitution = () => {
    router.push('/admin/institutions/new');
  };

  const handleInstitutionClick = (id: string) => {
    router.push(`/admin/institutions/${id}`);
  };

  if (isLoadingMyInstitution || isLoadingInstitutions) {
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

  // If user has an institution, show only that institution
  if (myInstitution) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Institution</h1>
          <Button onClick={() => handleInstitutionClick(myInstitution.id)}>
            View Details
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle>{myInstitution.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{myInstitution.address}</p>
              <p>
                {myInstitution.city}, {myInstitution.state}
              </p>
              <p>{myInstitution.contact_email}</p>
              <p>{myInstitution.contact_phone}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Institutions</h1>
        <Button onClick={handleCreateInstitution}>
          <Plus className="mr-2 h-4 w-4" />
          Create Institution
        </Button>
      </div>

      {institutions?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No institutions found</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleCreateInstitution}
            >
              Create your first institution
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {institutions?.map((institution) => (
            <Card
              key={institution.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleInstitutionClick(institution.id)}
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <CardTitle>{institution.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>{institution.address}</p>
                  <p>
                    {institution.city}, {institution.state}
                  </p>
                  <p>{institution.contact_email}</p>
                  <p>{institution.contact_phone}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}