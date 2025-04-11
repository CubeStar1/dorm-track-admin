import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Calendar, Info, Wrench } from 'lucide-react';
import { Student } from '@/lib/api/services/students';

const statusColors = {
  pending: 'bg-yellow-500',
  in_progress: 'bg-blue-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500'
};

const priorityColors = {
  low: 'bg-blue-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500'
};

export function MaintenanceRequests({ student }: { student: Student }) {
  if (!student.maintenance_requests || student.maintenance_requests.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-2 border-blue-200 dark:border-blue-800">
      <CardHeader className="border-b border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <CardTitle className="text-blue-900 dark:text-blue-100">Maintenance Requests</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {student.maintenance_requests.map((request) => (
            <div key={request.id} className="border-b border-blue-200 dark:border-blue-800 pb-6 last:border-0 last:pb-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                    <Info className="h-4 w-4" />
                    <span>Issue</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-medium text-blue-900 dark:text-blue-100">
                      {request.issue_type}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {request.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                    <Calendar className="h-4 w-4" />
                    <span>Timeline</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      Submitted: {format(new Date(request.created_at), 'MMM d, yyyy')}
                    </p>
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      Last Updated: {format(new Date(request.updated_at), 'MMM d, yyyy')}
                    </p>
                    {request.room && (
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        Location: Block {request.room.block} - Room {request.room.room_number}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Badge className={`${priorityColors[request.priority]} text-white`}>
                  {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                </Badge>
                <Badge className={`${statusColors[request.status]} text-white`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 