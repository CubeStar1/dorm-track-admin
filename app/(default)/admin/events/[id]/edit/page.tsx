'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { eventsService } from '@/lib/api/services/events';
import { EventForm } from '@/components/events/event-form';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { use } from 'react';

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsService.getEvent(id),
  });

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-10">
        <div className="space-y-6">
          <Skeleton className="h-8 w-[100px]" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-[250px]" />
            <Skeleton className="h-4 w-[450px]" />
          </div>
          <div className="rounded-lg border bg-card p-8">
            <div className="space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-2 gap-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container max-w-4xl mx-auto py-10">
        <div className="rounded-lg border bg-card p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Event Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The requested event could not be found.
          </p>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const formData = {
    id: event.id,
    title: event.title,
    description: event.description,
    category: event.category,
    event_date: format(new Date(event.event_date), "yyyy-MM-dd'T'HH:mm"),
    location: event.location,
    max_participants: event.max_participants?.toString() || '',
    registration_deadline: event.registration_deadline
      ? format(new Date(event.registration_deadline), "yyyy-MM-dd'T'HH:mm")
      : '',
    image_url: event.image_url || '',
  };

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="gap-2 mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Button>

        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Edit Event</h1>
          <p className="text-muted-foreground">
            Make changes to your event details below.
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-8">
        <EventForm initialData={formData} />
      </div>
    </div>
  );
} 