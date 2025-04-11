'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Hostel, hostelService } from '@/lib/api/services/hostels';
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
import { Building2 } from 'lucide-react';

const editHostelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  contactEmail: z.string().email('Invalid email'),
  contactPhone: z.string().min(10, 'Invalid phone number'),
  totalBlocks: z.number().min(1, 'Must have at least 1 block'),
  totalRooms: z.number().min(1, 'Must have at least 1 room')
});

type EditHostelFormData = z.infer<typeof editHostelSchema>;

interface EditHostelFormProps {
  hostel: Hostel;
  onSuccess?: () => void;
}

export function EditHostelForm({ hostel, onSuccess }: EditHostelFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<EditHostelFormData>({
    resolver: zodResolver(editHostelSchema),
    defaultValues: {
      name: hostel.name,
      code: hostel.code,
      address: hostel.address,
      city: hostel.city,
      state: hostel.state,
      contactEmail: hostel.contact_email,
      contactPhone: hostel.contact_phone,
      totalBlocks: hostel.total_blocks,
      totalRooms: hostel.total_rooms
    }
  });

  const onSubmit = async (formData: EditHostelFormData) => {
    try {
      const apiData = {
        name: formData.name,
        code: formData.code,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        total_blocks: formData.totalBlocks,
        total_rooms: formData.totalRooms
      };

      await hostelService.updateHostel(hostel.id, apiData);
      
      // Invalidate and refetch hostels queries
      await queryClient.invalidateQueries({ queryKey: ['hostels'] });
      
      toast.success('Hostel updated successfully');
      onSuccess?.();
      router.refresh();
    } catch (error) {
      console.error('Hostel update error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update hostel');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hostel Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter hostel name" className="rounded-lg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hostel Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter hostel code" className="rounded-lg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter hostel address" className="rounded-lg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Enter city" className="rounded-lg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="Enter state" className="rounded-lg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter contact email" className="rounded-lg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter contact phone" className="rounded-lg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="totalBlocks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Blocks</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1}
                    className="rounded-lg"
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
            name="totalRooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Rooms</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min={1}
                    className="rounded-lg"
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" className="rounded-lg">
            Update Hostel
          </Button>
          <Button type="button" variant="outline" className="rounded-lg" onClick={() => onSuccess?.()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
} 