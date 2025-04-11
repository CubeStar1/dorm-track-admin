'use client';

import { useStudents } from '@/lib/api/services/students';
import { StudentList } from '@/components/students/student-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentsPage() {
  const router = useRouter();
  const { data: students, isLoading, error } = useStudents();

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              Error loading students. Please try again later.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Students</h1>
        <Button onClick={() => router.push('/admin/students/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <StudentList
              students={students || []}
              onViewDetails={(id) => router.push(`/admin/students/${id}`)}
            />
          )}
    </div>
  );
} 