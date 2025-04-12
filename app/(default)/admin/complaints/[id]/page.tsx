'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Complaint,
  ComplaintStatus,
  ComplaintType,
  complaintsService,
} from '@/lib/api/services/complaints';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  AlertCircle, 
  User, 
  Mail, 
  Building2, 
  DoorOpen, 
  Calendar, 
  FileText, 
  ShieldAlert,
  MessageSquare,
  Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { toast } from 'sonner';

const statusColors: Record<ComplaintStatus, string> = {
  pending: 'bg-yellow-500',
  investigating: 'bg-blue-500',
  resolved: 'bg-green-500',
  dismissed: 'bg-red-500',
};

const statusBgColors: Record<ComplaintStatus, string> = {
  pending: 'bg-yellow-50 border-yellow-200',
  investigating: 'bg-blue-50 border-blue-200',
  resolved: 'bg-green-50 border-green-200',
  dismissed: 'bg-red-50 border-red-200',
};

const complaintTypeLabels: Record<ComplaintType, string> = {
  ragging: 'Ragging',
  harassment: 'Harassment',
  facilities: 'Facilities',
  mess: 'Mess',
  other: 'Other',
};

const severityColors = {
  low: 'bg-blue-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
};

const severityBgColors = {
  low: 'bg-blue-50 border-blue-200',
  medium: 'bg-yellow-50 border-yellow-200',
  high: 'bg-red-50 border-red-200',
};

export default function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<ComplaintStatus>();
  const [resolutionNotes, setResolutionNotes] = useState('');
  const {id}  = use(params)

  const { data: complaint, isLoading } = useQuery({
    queryKey: ['complaints', id],
    queryFn: () => complaintsService.getComplaint(id),
  });

  const updateComplaintMutation = useMutation({
    mutationFn: (data: { status: ComplaintStatus; resolution_notes?: string }) =>
      complaintsService.updateComplaint(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      toast.success('Complaint status updated successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleUpdateStatus = () => {
    if (!status) return;
    updateComplaintMutation.mutate({
      status,
      resolution_notes: resolutionNotes,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!complaint) {
    return <div>Complaint not found</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Complaints
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Complaint Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Complaint Overview Card */}
          <Card className={`${severityBgColors[complaint.severity]} border-2`}>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <CardTitle>Complaint Overview</CardTitle>
                </div>
                <Badge className={`${severityColors[complaint.severity]} text-white`}>
                  {complaint.severity.toUpperCase()} Severity
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Type</span>
                  </div>
                  <Badge variant="outline" className="text-base">
                    {complaintTypeLabels[complaint.complaint_type]}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Status</span>
                  </div>
                  <Badge className={`${statusColors[complaint.status]} text-white`}>
                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description Card */}
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 border-2 border-purple-200 dark:border-purple-800">
            <CardHeader className="border-b border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <CardTitle className="text-purple-900 dark:text-purple-100">Description</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {complaint.description}
              </p>
            </CardContent>
          </Card>

          {/* Student Information Card */}
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 border-2 border-indigo-200 dark:border-indigo-800">
            <CardHeader className="border-b border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <CardTitle className="text-indigo-900 dark:text-indigo-100">Student Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
                    <User className="h-4 w-4" />
                    <span>Name</span>
                  </div>
                  <p className="text-lg font-medium text-indigo-900 dark:text-indigo-100">
                    {complaint.is_anonymous ? 'Anonymous' : complaint.student?.user.full_name}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
                    <Mail className="h-4 w-4" />
                    <span>Contact</span>
                  </div>
                  <p className="text-lg font-medium text-indigo-900 dark:text-indigo-100">
                    {complaint.is_anonymous ? 'Not available' : complaint.student?.user.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information Card */}
          <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950 border-2 border-teal-200 dark:border-teal-800">
            <CardHeader className="border-b border-teal-200 dark:border-teal-800">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <CardTitle className="text-teal-900 dark:text-teal-100">Location Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400">
                    <Building2 className="h-4 w-4" />
                    <span>Hostel</span>
                  </div>
                  <p className="text-lg font-medium text-teal-900 dark:text-teal-100">{complaint.hostel?.name}</p>
                </div>

                {complaint.room && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400">
                      <DoorOpen className="h-4 w-4" />
                      <span>Room</span>
                    </div>
                    <p className="text-lg font-medium text-teal-900 dark:text-teal-100">
                      Block {complaint.room.block} - Room {complaint.room.room_number}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline Information Card */}
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-2 border-amber-200 dark:border-amber-800">
            <CardHeader className="border-b border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <CardTitle className="text-amber-900 dark:text-amber-100">Timeline</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                  <Calendar className="h-4 w-4" />
                  <span>Submitted On</span>
                </div>
                <p className="text-lg font-medium text-amber-900 dark:text-amber-100">
                  {format(new Date(complaint.created_at), 'PPpp')}
                </p>
              </div>
            </CardContent>
          </Card>

          {complaint.resolution_notes && (
            <Card className={`${statusBgColors[complaint.status]} border-2`}>
              <CardHeader className="border-b">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <CardTitle>Resolution Notes</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {complaint.resolution_notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Status Update Card */}
        <Card className="border-2 h-fit">
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              <CardTitle>Update Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as ComplaintStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Resolution Notes</label>
              <Textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Add notes about the resolution or any actions taken..."
                className="min-h-[150px]"
              />
            </div>

            <Button
              className="w-full"
              onClick={handleUpdateStatus}
              disabled={!status || updateComplaintMutation.isPending}
            >
              Update Status
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 