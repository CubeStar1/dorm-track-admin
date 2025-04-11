import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { EventRegistration } from '@/lib/api/services/events';

interface EventRegistrationsProps {
  registrations: EventRegistration[];
}

const registrationStatusColors = {
  registered: 'bg-green-100 text-green-800',
  attended: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
} as const;

export function EventRegistrations({ registrations }: EventRegistrationsProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {registration.student?.full_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {registration.student?.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(registration.created_at), 'MMM d, yyyy h:mm a')}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={registrationStatusColors[registration.status]}
                  >
                    {registration.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {registration.status === 'registered' && (
                    <button
                      onClick={() => {
                        // TODO: Add mark as attended functionality
                      }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Mark as Attended
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {registrations.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-6 text-gray-500"
                >
                  No registrations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 