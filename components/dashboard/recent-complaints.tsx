'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Complaint, ComplaintStatus, ComplaintType, complaintsService } from '@/lib/api/services/complaints';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useQuery } from "@tanstack/react-query";
import { useInstitution } from "@/lib/hooks/use-institution";

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

interface RecentComplaintsProps {
  limit?: number;
}

export function RecentComplaints({ limit = 5 }: RecentComplaintsProps) {
  const router = useRouter();
  const { institutionId } = useInstitution();

  const { data: complaints, isLoading } = useQuery({
    queryKey: ['recent-complaints', institutionId],
    queryFn: () => complaintsService.getComplaints(),
    enabled: !!institutionId
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentComplaints = complaints?.slice(0, limit) || [];

  if (recentComplaints.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">No complaints found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Complaints</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead className="w-[30%]">Description</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentComplaints.map((complaint) => (
              <TableRow
                key={complaint.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/admin/complaints/${complaint.id}`)}
              >
                <TableCell className="font-medium">
                  {complaintTypeLabels[complaint.complaint_type]}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {complaint.description}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={severityColors[complaint.severity]}>
                    {complaint.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[complaint.status]}>
                    {complaint.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(complaint.created_at), 'MMM d, yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 