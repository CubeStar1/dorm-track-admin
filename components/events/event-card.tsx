import { Calendar, MapPin, Users } from 'lucide-react';
import { Event } from '@/lib/api/services/events';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface EventCardProps {
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

export function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/admin/events/${event.id}`}
      className="block overflow-hidden bg-white rounded-xl border transition-all hover:shadow-lg"
    >
      {event.image_url ? (
        <div className="aspect-[2/1] relative overflow-hidden">
          <img
            src={event.image_url}
            alt={event.title}
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div className="aspect-[2/1] bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-semibold text-lg line-clamp-1">{event.title}</h3>
          <Badge
            variant="secondary"
            className={eventStatusColors[event.status]}
          >
            {event.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {event.description}
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              {format(new Date(event.event_date), 'MMM d, yyyy h:mm a')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
          {event.max_participants && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>
                {event.registration_count || 0} / {event.max_participants} registered
              </span>
            </div>
          )}
        </div>
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <Badge
            variant="secondary"
            className={eventCategoryColors[event.category]}
          >
            {event.category}
          </Badge>
          {event.organizer && (
            <span className="text-sm text-gray-600">
              by {event.organizer.full_name}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
} 