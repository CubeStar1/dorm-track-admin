'use client';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Complaint, ComplaintStatus, ComplaintType } from '@/lib/api/services/complaints';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { ChevronRightIcon } from 'lucide-react';

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

interface ComplaintsTableProps {
  complaints: Complaint[];
}

export function ComplaintsTable({ complaints }: ComplaintsTableProps) {
  const router = useRouter();

  if (complaints.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border">
        <p className="text-gray-500">No complaints found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead className="w-[30%]">Description</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="w-8"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.map((complaint) => (
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
              <TableCell>
                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 