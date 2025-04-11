'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Complaint, ComplaintStatus, ComplaintType } from '@/lib/api/services/complaints';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

const statusColors: Record<ComplaintStatus, string> = {
  pending: 'bg-yellow-500',
  investigating: 'bg-blue-500',
  resolved: 'bg-green-500',
  dismissed: 'bg-red-500',
};

const complaintTypeLabels: Record<ComplaintType, string> = {
  ragging: 'Ragging',
  harassment: 'Harassment',
  facilities: 'Facilities',
  mess: 'Mess',
  other: 'Other',
};

const severityColors = {
  low: 'bg-blue-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
};

interface ComplaintCardProps {
  complaint: Complaint;
}

export function ComplaintCard({ complaint }: ComplaintCardProps) {
  const router = useRouter();

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/admin/complaints/${complaint.id}`)}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">
            {complaintTypeLabels[complaint.complaint_type]}
          </Badge>
          <Badge className={severityColors[complaint.severity]}>
            {complaint.severity.toUpperCase()}
          </Badge>
        </div>
        <div className="line-clamp-2 font-medium">
          {complaint.description}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">Student</p>
            <p className="truncate">
              {complaint.is_anonymous
                ? 'Anonymous'
                : complaint.student?.user.full_name}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Hostel</p>
            <p className="truncate">{complaint.hostel?.name}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge className={statusColors[complaint.status]}>
            {complaint.status.charAt(0).toUpperCase() +
              complaint.status.slice(1)}
          </Badge>
          <span className="text-sm text-gray-500">
            {format(new Date(complaint.created_at), 'MMM d, yyyy')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
} 