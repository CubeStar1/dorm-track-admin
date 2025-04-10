'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
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
import { Card } from "@/components/ui/card";

// Role selection schema
const roleSelectionSchema = z.object({
  role: z.enum(['admin', 'warden'], {
    required_error: 'Please select your role',
  }),
});

// Base schema for common fields
const baseProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(10, 'Invalid phone number'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select your gender',
  }),
  employeeId: z.string().min(1, 'Employee ID is required'),
  department: z.string().min(1, 'Department is required'),
  institutionId: z.string().uuid('Please select an institution'),
});

// Admin-specific schema
const adminProfileSchema = baseProfileSchema;

// Warden-specific schema
const wardenProfileSchema = baseProfileSchema.extend({
  hostelId: z.string().uuid('Please select a hostel'),
});

type RoleSelectionValues = z.infer<typeof roleSelectionSchema>;
type AdminProfileValues = z.infer<typeof adminProfileSchema>;
type WardenProfileValues = z.infer<typeof wardenProfileSchema>;

export default function CompleteProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/dashboard';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'warden' | null>(null);
  const supabase = createSupabaseBrowser();

  // Role selection form
  const roleForm = useForm<RoleSelectionValues>({
    resolver: zodResolver(roleSelectionSchema),
  });

  // Profile forms
  const adminForm = useForm<AdminProfileValues>({
    resolver: zodResolver(adminProfileSchema),
  });

  const wardenForm = useForm<WardenProfileValues>({
    resolver: zodResolver(wardenProfileSchema),
  });

  // Fetch institutions
  const { data: institutions, isLoading: isLoadingInstitutions } = useQuery({
    queryKey: ['institutions'],
    queryFn: async () => {
      const response = await fetch('/api/institutions');
      if (!response.ok) throw new Error('Failed to fetch institutions');
      return response.json();
    },
  });

  // Fetch hostels based on selected institution
  const { data: hostels, isLoading: isLoadingHostels } = useQuery({
    queryKey: ['hostels', wardenForm.watch('institutionId')],
    queryFn: async () => {
      const institutionId = wardenForm.watch('institutionId');
      if (!institutionId) return [];
      const response = await fetch(`/api/hostels?institutionId=${institutionId}`);
      if (!response.ok) throw new Error('Failed to fetch hostels');
      return response.json();
    },
    enabled: !!wardenForm.watch('institutionId') && selectedRole === 'warden',
  });

  const onRoleSubmit = (data: RoleSelectionValues) => {
    setSelectedRole(data.role);
  };

  const onProfileSubmit = async (data: AdminProfileValues | WardenProfileValues) => {
    try {
      setIsSubmitting(true);
      
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Not authenticated');

      // Submit the form data
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          role: selectedRole,
          email: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete registration');
      }

      toast.success('Profile completed successfully!');
      router.push(nextUrl);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render role selection form
  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
          <div className="space-y-4">
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Select Your Role
            </h2>
            <p className="text-center text-sm text-gray-600">
              Choose your role to proceed with registration
            </p>
          </div>

          <Form {...roleForm}>
            <form onSubmit={roleForm.handleSubmit(onRoleSubmit)} className="space-y-6">
              <FormField
                control={roleForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-1 gap-4">
                      <Card
                        className={`p-6 cursor-pointer transition-all ${
                          field.value === 'admin' ? 'border-indigo-600 bg-indigo-50' : ''
                        }`}
                        onClick={() => field.onChange('admin')}
                      >
                        <div className="font-semibold">Institution Admin</div>
                        <div className="text-sm text-gray-600">Manage institution-wide settings and users</div>
                      </Card>
                      <Card
                        className={`p-6 cursor-pointer transition-all ${
                          field.value === 'warden' ? 'border-indigo-600 bg-indigo-50' : ''
                        }`}
                        onClick={() => field.onChange('warden')}
                      >
                        <div className="font-semibold">Hostel Warden</div>
                        <div className="text-sm text-gray-600">Manage hostel operations and residents</div>
                      </Card>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl h-11 mt-8"
              >
                Continue
              </Button>
            </form>
          </Form>
        </div>
      </div>
    );
  }

  // Common form fields component
  const CommonFields = ({ form }: { form: any }) => (
    <>
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700">Full Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="John Doe" 
                {...field}
                className="rounded-xl h-11" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Phone Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="+1234567890" 
                  {...field}
                  className="rounded-xl h-11" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Gender</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="institutionId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700">Institution</FormLabel>
            <Select
              disabled={isLoadingInstitutions}
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue placeholder="Select your institution" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {institutions?.map((institution: any) => (
                  <SelectItem key={institution.id} value={institution.id}>
                    {institution.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Employee ID</FormLabel>
              <FormControl>
                <Input 
                  placeholder="EMP001" 
                  {...field}
                  className="rounded-xl h-11" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Department</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Administration" 
                  {...field}
                  className="rounded-xl h-11" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
        <div className="space-y-4">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Complete Your Profile
          </h2>
          <p className="text-center text-sm text-gray-600">
            Please provide your details to complete the registration
          </p>
        </div>

        {selectedRole === 'admin' ? (
          <Form {...adminForm}>
            <form onSubmit={adminForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              <CommonFields form={adminForm} />
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl h-11 mt-8"
                disabled={isSubmitting || isLoadingInstitutions}
              >
                {isSubmitting ? 'Completing...' : 'Complete Registration'}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...wardenForm}>
            <form onSubmit={wardenForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              <CommonFields form={wardenForm} />
              <FormField
                control={wardenForm.control}
                name="hostelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Hostel</FormLabel>
                    <Select
                      disabled={isLoadingHostels}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-xl h-11">
                          <SelectValue placeholder="Select hostel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hostels?.map((hostel: any) => (
                          <SelectItem key={hostel.id} value={hostel.id}>
                            {hostel.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl h-11 mt-8"
                disabled={isSubmitting || isLoadingInstitutions || isLoadingHostels}
              >
                {isSubmitting ? 'Completing...' : 'Complete Registration'}
              </Button>
            </form>
          </Form>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full rounded-xl h-11"
          onClick={() => setSelectedRole(null)}
        >
          Back to Role Selection
        </Button>
      </div>
    </div>
  );
} 