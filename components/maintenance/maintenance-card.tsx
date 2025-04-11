'use client';

import { MaintenanceRequest } from '@/lib/api/services/maintenance';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

const priorityColors = {
  low: 'bg-blue-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
};

const statusColors = {
  pending: 'bg-yellow-500',
  in_progress: 'bg-blue-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const issueTypeLabels = {
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  furniture: 'Furniture',
  cleaning: 'Cleaning',
  other: 'Other',
};

interface MaintenanceCardProps {
  request: MaintenanceRequest;
}

export function MaintenanceCard({ request }: MaintenanceCardProps) {
  const router = useRouter();

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/admin/maintenance/${request.id}`)}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">
            {issueTypeLabels[request.issue_type]}
          </Badge>
          <Badge className={priorityColors[request.priority]}>
            {request.priority.toUpperCase()}
          </Badge>
        </div>
        <div className="line-clamp-2 font-medium">
          {request.description}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">Room</p>
            <p className="truncate">
              Room {request.room?.room_number}, Block {request.room?.block}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Student</p>
            <p className="truncate">{request.student?.user.full_name}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge className={statusColors[request.status]}>
            {request.status.replace('_', ' ').toUpperCase()}
          </Badge>
          <span className="text-sm text-gray-500">
            {format(new Date(request.created_at), 'MMM d, yyyy')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
} 