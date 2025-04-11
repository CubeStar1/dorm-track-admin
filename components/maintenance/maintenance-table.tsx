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
import { MaintenanceRequest } from '@/lib/api/services/maintenance';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { ChevronRightIcon } from 'lucide-react';

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

interface MaintenanceTableProps {
  requests: MaintenanceRequest[];
}

export function MaintenanceTable({ requests }: MaintenanceTableProps) {
  const router = useRouter();

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border">
        <p className="text-gray-500">No maintenance requests found</p>
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
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="w-8"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow
              key={request.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => router.push(`/admin/maintenance/${request.id}`)}
            >
              <TableCell className="font-medium">
                {issueTypeLabels[request.issue_type]}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {request.description}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={priorityColors[request.priority]}>
                  {request.priority.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={statusColors[request.status]}>
                  {request.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                Room {request.room?.room_number}, Block {request.room?.block}
              </TableCell>
              <TableCell>
                {format(new Date(request.created_at), 'MMM d, yyyy')}
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