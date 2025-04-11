'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Hostel, CreateHostelData, hostelService } from '@/lib/api/services/hostels';
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
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ArrowLeft, Building2 } from 'lucide-react';
import Link from 'next/link';

const hostelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  contactEmail: z.string().email('Invalid email'),
  contactPhone: z.string().min(10, 'Invalid phone number'),
  totalBlocks: z.number().min(1, 'Must have at least 1 block'),
  totalRooms: z.number().min(1, 'Must have at least 1 room'),
  institution_id: z.string().uuid('Invalid institution ID')
});

type HostelFormData = z.infer<typeof hostelSchema>;

interface HostelFormProps {
  hostel?: Hostel;
  institutionId: string;
  onSuccess?: () => void;
  hideBackButton?: boolean;
}

export function HostelForm({ 
  hostel, 
  institutionId, 
  onSuccess,
  hideBackButton = false 
}: HostelFormProps) {
  const router = useRouter();
  const form = useForm<HostelFormData>({
    resolver: zodResolver(hostelSchema),
    defaultValues: hostel ? {
      ...hostel,
      contactEmail: hostel.contact_email,
      contactPhone: hostel.contact_phone,
      totalBlocks: hostel.total_blocks,
      totalRooms: hostel.total_rooms,
      institution_id: hostel.institution_id
    } : {
      name: '',
      code: '',
      address: '',
      city: '',
      state: '',
      contactEmail: '',
      contactPhone: '',
      totalBlocks: 1,
      totalRooms: 1,
      institution_id: institutionId
    }
  });

  const onSubmit = async (formData: HostelFormData) => {
    try {
      // Transform the data to match the API expectations
      const apiData = {
        name: formData.name,
        code: formData.code,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        total_blocks: formData.totalBlocks,
        total_rooms: formData.totalRooms,
        institution_id: formData.institution_id
      };

      if (hostel) {
        await hostelService.updateHostel(hostel.id, apiData);
        toast.success('Hostel updated successfully');
      } else {
        await hostelService.createHostel(apiData);
        toast.success('Hostel created successfully');
      }
      onSuccess?.();
      router.push('/admin/hostels');
      router.refresh();
    } catch (error) {
      console.error('Hostel save error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save hostel');
    }
  };

  return (
    <div>
      {!hideBackButton && (
        <div className="mb-6">
          <Button
            variant="ghost"
            className="gap-2"
            asChild
          >
            <Link href="/admin/hostels">
              <ArrowLeft className="w-4 h-4" />
              Back to Hostels
            </Link>
          </Button>
        </div>
      )}

      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-2xl font-bold tracking-tight">
              {hostel ? 'Edit Hostel' : 'Create New Hostel'}
            </h2>
          </div>
          <p className="text-muted-foreground">
            {hostel 
              ? 'Update the hostel information below' 
              : 'Fill in the details to create a new hostel'}
          </p>
        </CardHeader>
        <CardContent>
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

              <input type="hidden" {...form.register('institution_id')} />

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="rounded-lg">
                  {hostel ? 'Update Hostel' : 'Create Hostel'}
                </Button>
                <Button type="button" variant="outline" className="rounded-lg" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 