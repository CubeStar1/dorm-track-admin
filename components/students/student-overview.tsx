import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Shield, User } from 'lucide-react';
import { Student } from '@/lib/api/services/students';

export function StudentOverview({ student }: { student: Student }) {
  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 border-2 border-indigo-200 dark:border-indigo-800">
      <CardHeader className="border-b border-indigo-200 dark:border-indigo-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <CardTitle className="text-indigo-900 dark:text-indigo-100">Student Overview</CardTitle>
          </div>
          <Badge variant="outline" className="text-base">
            {student.student_id}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
              <GraduationCap className="h-4 w-4" />
              <span>Department</span>
            </div>
            <p className="text-lg font-medium text-indigo-900 dark:text-indigo-100">
              {student.department || 'Not specified'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
              <GraduationCap className="h-4 w-4" />
              <span>Year of Study</span>
            </div>
            <p className="text-lg font-medium text-indigo-900 dark:text-indigo-100">
              {student.year_of_study ? `Year ${student.year_of_study}` : 'Not specified'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
              <User className="h-4 w-4" />
              <span>Gender</span>
            </div>
            <p className="text-lg font-medium text-indigo-900 dark:text-indigo-100">
              {student.user.gender || 'Not specified'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
              <Shield className="h-4 w-4" />
              <span>Role</span>
            </div>
            <p className="text-lg font-medium text-indigo-900 dark:text-indigo-100">
              {student.user.role}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 