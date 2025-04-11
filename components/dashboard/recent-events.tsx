'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from '@/lib/api/services/events';
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { eventsService } from "@/lib/api/services/events";
import { useInstitution } from "@/lib/hooks/use-institution";

interface RecentEventsProps {
  limit?: number;
}

function getEventStatusColor(startDate: Date, endDate: Date): "outline" | "default" | "secondary" {
  const now = new Date();
  if (now < startDate) return "default"; // Upcoming
  if (now >= startDate && now <= endDate) return "outline"; // Ongoing
  return "secondary"; // Completed
}

function getEventStatus(startDate: Date, endDate: Date): string {
  const now = new Date();
  if (now < startDate) return "Upcoming";
  if (now >= startDate && now <= endDate) return "Ongoing";
  return "Completed";
}

export function RecentEvents({ limit = 5 }: RecentEventsProps) {
  const router = useRouter();
  const { institutionId } = useInstitution();

  const { data: events, isLoading } = useQuery({
    queryKey: ['recent-events', institutionId],
    queryFn: () => eventsService.getEvents(),
    enabled: !!institutionId
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentEvents = events
    ?.filter(event => new Date(event.event_date) >= new Date())
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
    .slice(0, limit) || [];

  if (recentEvents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">No upcoming events found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Events</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registrations</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentEvents.map((event) => {
              const startDate = new Date(event.event_date);
              const endDate = new Date(event.event_date);
              endDate.setHours(endDate.getHours() + 2); // Assuming 2-hour events if no end time
              const status = getEventStatus(startDate, endDate);
              const statusColor = getEventStatusColor(startDate, endDate);

              return (
                <TableRow
                  key={event.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/admin/events/${event.id}`)}
                >
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>
                    {format(startDate, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>
                    <Badge variant={statusColor}>
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell>{event.registration_count || 0}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 