'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { studentsService } from '@/lib/api/services/students';
import { StudentOverview } from '@/components/students/student-overview';
import { ContactInfo } from '@/components/students/contact-info';
import { LocationInfo } from '@/components/students/location-info';
import { MaintenanceRequests } from '@/components/students/maintenance-requests';
import { Complaints } from '@/components/students/complaints';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { use } from 'react';

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const { data: student, isLoading } = useQuery({
    queryKey: ['student', id],
    queryFn: () => studentsService.getStudent(id),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!student) {
    return <div>Student not found</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Students
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <StudentOverview student={student} />
          <ContactInfo student={student} />
          <LocationInfo student={student} />
          <MaintenanceRequests student={student} />
          <Complaints student={student} />
        </div>

        {/* Timeline Sidebar */}
        <div className="space-y-6">
          <Card className="">
            <CardHeader className="border-b border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-blue-900 dark:text-blue-100">Timeline</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                    <Calendar className="h-4 w-4" />
                    <span>Joined On</span>
                  </div>
                  <p className="text-lg font-medium text-blue-900 dark:text-blue-100">
                    {format(new Date(student.created_at), 'PPpp')}
                  </p>
                </div>

                {student.room_allocations && student.room_allocations.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                      <Calendar className="h-4 w-4" />
                      <span>Room Allocation History</span>
                    </div>
                    <div className="space-y-2">
                      {student.room_allocations.map((allocation) => (
                        <div key={allocation.id} className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                          <p className="text-sm text-blue-900 dark:text-blue-100">
                            {format(new Date(allocation.start_date), 'MMM d, yyyy')} -{' '}
                            {allocation.end_date
                              ? format(new Date(allocation.end_date), 'MMM d, yyyy')
                              : 'Present'}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            Block {allocation.room.block} - Room {allocation.room.room_number}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {student.maintenance_requests && student.maintenance_requests.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                      <Calendar className="h-4 w-4" />
                      <span>Maintenance Requests</span>
                    </div>
                    <div className="space-y-2">
                      {student.maintenance_requests.map((request) => (
                        <div key={request.id} className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                          <p className="text-sm text-blue-900 dark:text-blue-100">
                            {format(new Date(request.created_at), 'MMM d, yyyy')}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            {request.issue_type}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {student.complaints && student.complaints.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                      <Calendar className="h-4 w-4" />
                      <span>Complaints</span>
                    </div>
                    <div className="space-y-2">
                      {student.complaints.map((complaint) => (
                        <div key={complaint.id} className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                          <p className="text-sm text-blue-900 dark:text-blue-100">
                            {format(new Date(complaint.created_at), 'MMM d, yyyy')}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            {complaint.complaint_type}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
