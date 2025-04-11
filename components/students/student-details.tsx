'use client';

import { StudentWithAllocations } from '@/lib/api/services/students';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  Building2,
  Calendar,
  DoorOpen,
  Mail,
  Phone,
  User,
  Users,
} from 'lucide-react';

interface StudentDetailsProps {
  student: StudentWithAllocations;
}

export function StudentDetails({ student }: StudentDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Personal Information Card */}
      <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 border-2 border-indigo-200 dark:border-indigo-800">
        <CardHeader className="border-b border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <CardTitle className="text-indigo-900 dark:text-indigo-100">
              Personal Information
            </CardTitle>
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
                {student.user.full_name}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </div>
              <p className="text-lg font-medium text-indigo-900 dark:text-indigo-100">
                {student.user.email}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
                <Phone className="h-4 w-4" />
                <span>Phone</span>
              </div>
              <p className="text-lg font-medium text-indigo-900 dark:text-indigo-100">
                {student.user.phone || 'Not provided'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
                <Users className="h-4 w-4" />
                <span>Gender</span>
              </div>
              <p className="text-lg font-medium text-indigo-900 dark:text-indigo-100">
                {student.user.gender || 'Not specified'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Information Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 border-2 border-purple-200 dark:border-purple-800">
        <CardHeader className="border-b border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <CardTitle className="text-purple-900 dark:text-purple-100">
              Academic Information
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                <span>Student ID</span>
              </div>
              <p className="text-lg font-medium text-purple-900 dark:text-purple-100">
                {student.student_id}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                <span>Department</span>
              </div>
              <p className="text-lg font-medium text-purple-900 dark:text-purple-100">
                {student.department || 'Not specified'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                <span>Year of Study</span>
              </div>
              <p className="text-lg font-medium text-purple-900 dark:text-purple-100">
                {student.year_of_study ? `Year ${student.year_of_study}` : 'Not specified'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Accommodation Card */}
      <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950 border-2 border-teal-200 dark:border-teal-800">
        <CardHeader className="border-b border-teal-200 dark:border-teal-800">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <CardTitle className="text-teal-900 dark:text-teal-100">
              Current Accommodation
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {student.hostel ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400">
                  <Building2 className="h-4 w-4" />
                  <span>Hostel</span>
                </div>
                <p className="text-lg font-medium text-teal-900 dark:text-teal-100">
                  {student.hostel.name}
                </p>
              </div>

              {student.room && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400">
                    <DoorOpen className="h-4 w-4" />
                    <span>Room</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-medium text-teal-900 dark:text-teal-100">
                      Block {student.room.block} - Room {student.room.room_number}
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline">Floor {student.room.floor}</Badge>
                      <Badge variant="outline">{student.room.room_type}</Badge>
                      <Badge variant="outline">
                        Capacity: {student.room.capacity}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">No accommodation assigned</p>
          )}
        </CardContent>
      </Card>

      {/* Room Allocation History Card */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-2 border-amber-200 dark:border-amber-800">
        <CardHeader className="border-b border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <CardTitle className="text-amber-900 dark:text-amber-100">
              Room Allocation History
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {student.room_allocations.length > 0 ? (
            <div className="space-y-4">
              {student.room_allocations.map((allocation) => (
                <div
                  key={allocation.id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">
                        Block {allocation.room.block} - Room{' '}
                        {allocation.room.room_number}
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          Floor {allocation.room.floor}
                        </Badge>
                        <Badge variant="outline">
                          {allocation.room.room_type}
                        </Badge>
                      </div>
                    </div>
                    <Badge
                      variant={
                        allocation.status === 'active' ? 'default' : 'outline'
                      }
                    >
                      {allocation.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      From: {format(new Date(allocation.start_date), 'PP')}
                    </p>
                    {allocation.end_date && (
                      <p>
                        To: {format(new Date(allocation.end_date), 'PP')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No room allocation history</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 