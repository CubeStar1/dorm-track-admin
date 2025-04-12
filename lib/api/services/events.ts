export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
export type EventCategory = 'cultural' | 'sports' | 'academic' | 'social' | 'other'
export type RegistrationStatus = 'registered' | 'attended' | 'cancelled'

export interface User {
  id: string
  full_name: string
  email: string
  phone?: string
}

export interface EventRegistration {
  id: string
  event_id: string
  student_id: string
  status: RegistrationStatus
  created_at: string
  updated_at: string
  student?: User
}

export interface Event {
  id: string
  institution_id: string
  title: string
  description: string
  event_date: string
  location: string
  max_participants?: number
  registration_deadline?: string
  image_url?: string
  organizer_id: string
  category: EventCategory
  status: EventStatus
  created_at: string
  updated_at: string
  organizer?: User
  registration_count?: number
  registrations?: EventRegistration[],
  is_registered?: boolean
}

export interface CreateEventPayload {
  title: string
  description: string
  event_date: string
  location: string
  max_participants?: number
  registration_deadline?: string
  image_url?: string
  category: EventCategory
}

export interface UpdateEventPayload {
  title?: string
  description?: string
  event_date?: string
  location?: string
  max_participants?: number
  registration_deadline?: string
  image_url?: string
  category?: EventCategory
  status?: EventStatus
}

class EventsService {
  async getEvents(): Promise<Event[]> {
    const response = await fetch('/api/events')
    if (!response.ok) {
      throw new Error('Failed to fetch events')
    }
    return response.json()
  }

  async getEvent(id: string): Promise<Event> {
    const response = await fetch(`/api/events/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch event')
    }
    return response.json()
  }

  async createEvent(data: CreateEventPayload): Promise<Event> {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create event')
    }
    return response.json()
  }

  async updateEvent(id: string, data: UpdateEventPayload): Promise<Event> {
    const response = await fetch(`/api/events/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update event')
    }
    return response.json()
  }

  async deleteEvent(id: string): Promise<void> {
    const response = await fetch(`/api/events/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete event')
    }
  }

  async registerForEvent(eventId: string): Promise<EventRegistration> {
    const response = await fetch(`/api/events/${eventId}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to register for event')
    }
    return response.json()
  }

  async cancelRegistration(eventId: string): Promise<void> {
    const response = await fetch(`/api/events/${eventId}/register`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to cancel registration')
    }
  }

  async getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
    const response = await fetch(`/api/events/${eventId}/registrations`)
    if (!response.ok) {
      throw new Error('Failed to fetch event registrations')
    }
    return response.json()
  }
}

export const eventsService = new EventsService() 