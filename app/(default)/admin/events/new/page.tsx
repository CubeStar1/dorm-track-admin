'use client';

import { EventForm } from '@/components/events/event-form';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function NewEventPage() {
  const router = useRouter();

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
          <h1 className="text-3xl font-bold">Create New Event</h1>
          <p className="text-muted-foreground">
            Fill in the details below to create a new event for your institution.
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-8">
        <EventForm />
      </div>
    </div>
  );
} 