'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Room } from '@/lib/api/services/rooms';
import { useQueryClient } from '@tanstack/react-query';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';

const roomSchema = z.object({
  room_number: z.string().min(1, 'Room number is required'),
  block: z.string().min(1, 'Block is required'),
  floor: z.number().min(0, 'Floor must be 0 or greater'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  room_type: z.string(),
  amenities: z.array(z.string()),
  status: z.enum(['available', 'occupied', 'maintenance']),
  price: z.number().min(0, 'Price must be 0 or greater'),
  description: z.string(),
  hostel_id: z.string().uuid('Invalid hostel ID')
});

type RoomFormData = z.infer<typeof roomSchema>;

interface RoomFormProps {
  room?: Room;
  hostelId: string;
  onSuccess?: () => void;
}

const AMENITIES_OPTIONS = [
  'AC',
  'Fan',
  'Attached Bathroom',
  'Hot Water',
  'Study Table',
  'Wardrobe',
  'Balcony',
  'WiFi'
];

export function RoomForm({ room, hostelId, onSuccess }: RoomFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: room || {
      hostel_id: hostelId,
      floor: 0,
      capacity: 1,
      room_type: 'Single',
      amenities: [],
      status: 'available',
      price: 0,
      description: ''
    }
  });

  const onSubmit = async (data: RoomFormData) => {
    try {
      const transformedData = {
        ...data,
        hostelId: data.hostel_id,
        roomNumber: data.room_number,
        roomType: data.room_type
      };

      const response = await fetch(room ? `/api/rooms/${room.id}` : '/api/rooms', {
        method: room ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save room');
      }

      // Invalidate relevant queries
      await queryClient.invalidateQueries({ queryKey: ['rooms'] });
      if (room) {
        await queryClient.invalidateQueries({ queryKey: ['room', room.id] });
      }
      await queryClient.invalidateQueries({ queryKey: ['hostel', hostelId] });

      toast.success(room ? 'Room updated successfully' : 'Room created successfully');
      onSuccess?.();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save room');
      console.error('Room save error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="room_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter room number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="block"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Block</FormLabel>
                <FormControl>
                  <Input placeholder="Enter block" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="floor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Floor</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={0}
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min={1}
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min={0}
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="room_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Double">Double</SelectItem>
                    <SelectItem value="Triple">Triple</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="amenities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amenities</FormLabel>
              <div className="flex flex-wrap gap-2">
                {AMENITIES_OPTIONS.map((amenity) => (
                  <Button
                    key={amenity}
                    type="button"
                    variant={field.value?.includes(amenity) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      const newValue = field.value?.includes(amenity)
                        ? field.value.filter(a => a !== amenity)
                        : [...(field.value || []), amenity];
                      field.onChange(newValue);
                    }}
                  >
                    {amenity}
                  </Button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter room description" 
                  {...field}
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <input type="hidden" {...form.register('hostel_id')} />

        <div className="flex gap-4">
          <Button type="submit">
            {room ? 'Update Room' : 'Create Room'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
} 