import { Event } from '@/lib/api/services/events';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, User, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface EventDetailsProps {
  event: Event;
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

export function EventDetails({ event }: EventDetailsProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">{event.title}</h1>
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className={eventCategoryColors[event.category]}
            >
              {event.category}
            </Badge>
            <Badge
              variant="secondary"
              className={eventStatusColors[event.status]}
            >
              {event.status}
            </Badge>
          </div>
        </div>
        
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Event Details */}
        <div className="col-span-2 space-y-6">
          {/* Event Image */}
          {event.image_url ? (
            <div className="aspect-video relative rounded-xl overflow-hidden">
              <img
                src={event.image_url}
                alt={event.title}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl" />
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 whitespace-pre-wrap">
                {event.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Event Info */}
        <div className="space-y-6">
          {/* Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle>Date & Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>{format(new Date(event.event_date), 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Clock className="h-5 w-5" />
                <span>{format(new Date(event.event_date), 'h:mm a')}</span>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>{event.location}</span>
              </div>
            </CardContent>
          </Card>

          {/* Registration Info */}
          <Card>
            <CardHeader>
              <CardTitle>Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {event.max_participants && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Users className="h-5 w-5" />
                  <span>
                    {event.registration_count || 0} / {event.max_participants} registered
                  </span>
                </div>
              )}
              {event.registration_deadline && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span>
                    Deadline: {format(new Date(event.registration_deadline), 'MMM d, yyyy')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Organizer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 text-gray-600">
                <User className="h-5 w-5" />
                <div>
                  <p className="font-medium">{event.organizer?.full_name}</p>
                  <p className="text-sm">{event.organizer?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 