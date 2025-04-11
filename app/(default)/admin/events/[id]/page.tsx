'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { eventsService } from '@/lib/api/services/events';
import { EventDetails } from '@/components/events/event-details';
import { EventRegistrations } from '@/components/events/event-registrations';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const { data: event, isLoading } = useQuery({
    queryKey: ['events', eventId],
    queryFn: () => eventsService.getEvent(eventId),
  });

  const deleteEvent = useMutation({
    mutationFn: () => eventsService.deleteEvent(eventId),
    onSuccess: () => {
      router.push('/admin/events');
    },
  });

  if (isLoading) {
    return (
      <div className="h-full p-6 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="h-full p-6 flex items-center justify-center">
        <p className="text-gray-500">Event not found</p>
      </div>
    );
  }

  return (
    <div className="h-full p-6">
      {/* Header with Back Button and Actions */}
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => router.push(`/admin/events/${eventId}/edit`)}
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Event</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this event? This action cannot be undone.
                  All registrations for this event will also be deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteEvent.mutate()}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="details" className="h-[calc(100%-4rem)] space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="details">Event Details</TabsTrigger>
            <TabsTrigger value="registrations">
              Registrations ({event.registrations?.length || 0})
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="details" className="h-[calc(100%-4rem)]">
          <EventDetails event={event} />
        </TabsContent>
        <TabsContent value="registrations" className="h-[calc(100%-4rem)]">
          <EventRegistrations registrations={event.registrations || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 