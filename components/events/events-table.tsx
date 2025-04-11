import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Event } from "@/lib/api/services/events";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface EventsTableProps {
  events: Event[];
}

const eventStatusColors = {
  upcoming: 'bg-blue-100 text-blue-800',
  ongoing: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
} as const;

const eventCategoryColors = {
  cultural: 'bg-purple-100 text-purple-800',
  sports: 'bg-orange-100 text-orange-800',
  academic: 'bg-indigo-100 text-indigo-800',
  social: 'bg-pink-100 text-pink-800',
  other: 'bg-gray-100 text-gray-800',
} as const;

export function EventsTable({ events }: EventsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Organizer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Registrations</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <Link
                  href={`/admin/events/${event.id}`}
                  className="font-medium hover:underline"
                >
                  {event.title}
                </Link>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {event.description}
                </p>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={eventCategoryColors[event.category]}
                >
                  {event.category}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(event.event_date), 'MMM d, yyyy h:mm a')}
              </TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>
                {event.organizer?.full_name || 'Unknown'}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={eventStatusColors[event.status]}
                >
                  {event.status}
                </Badge>
              </TableCell>
              <TableCell>
                {event.max_participants ? (
                  <span>
                    {event.registration_count || 0} / {event.max_participants}
                  </span>
                ) : (
                  <span>
                    {event.registration_count || 0} registered
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
          {events.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                No events found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
} 