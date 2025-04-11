import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { AlertCircle, Calendar, Info, MessageSquare, ExternalLink } from 'lucide-react';
import { Student } from '@/lib/api/services/students';
import { useRouter } from 'next/navigation';

const statusColors = {
  pending: 'bg-yellow-500',
  investigating: 'bg-blue-500',
  resolved: 'bg-green-500',
  dismissed: 'bg-red-500'
};

const severityColors = {
  low: 'bg-blue-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500'
};

export function Complaints({ student }: { student: Student }) {
  const router = useRouter();

  if (!student.complaints || student.complaints.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950 border-2 border-red-200 dark:border-red-800">
      <CardHeader className="border-b border-red-200 dark:border-red-800">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <CardTitle className="text-red-900 dark:text-red-100">Complaints</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {student.complaints.map((complaint) => (
            <div 
              key={complaint.id} 
              className="border-b border-red-200 dark:border-red-800 pb-6 last:border-0 last:pb-0 rounded-md p-4 group relative"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                    <Info className="h-4 w-4" />
                    <span>Details</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-medium text-red-900 dark:text-red-100">
                      {complaint.complaint_type}
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {complaint.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                    <Calendar className="h-4 w-4" />
                    <span>Timeline</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-red-900 dark:text-red-100">
                      Submitted: {format(new Date(complaint.created_at), 'MMM d, yyyy')}
                    </p>
                    <p className="text-sm text-red-900 dark:text-red-100">
                      Last Updated: {format(new Date(complaint.updated_at), 'MMM d, yyyy')}
                    </p>
                    {complaint.room && (
                      <p className="text-sm text-red-900 dark:text-red-100">
                        Location: Block {complaint.room.block} - Room {complaint.room.room_number}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Badge className={`${severityColors[complaint.severity]} text-white`}>
                  {complaint.severity.charAt(0).toUpperCase() + complaint.severity.slice(1)} Severity
                </Badge>
                <Badge className={`${statusColors[complaint.status]} text-white`}>
                  {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                </Badge>
                {complaint.is_anonymous && (
                  <Badge variant="outline">Anonymous</Badge>
                )}
              </div>

              {complaint.resolution_notes && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                    <MessageSquare className="h-4 w-4" />
                    <span>Resolution Notes</span>
                  </div>
                  <p className="mt-1 text-sm text-red-900 dark:text-red-100">
                    {complaint.resolution_notes}
                  </p>
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => router.push(`/admin/complaints/${complaint.id}`)}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 