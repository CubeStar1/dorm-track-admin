import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone } from 'lucide-react';
import { Student } from '@/lib/api/services/students';

export function ContactInfo({ student }: { student: Student }) {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 border-2 border-purple-200 dark:border-purple-800">
      <CardHeader className="border-b border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <CardTitle className="text-purple-900 dark:text-purple-100">Contact Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </div>
            <p className="text-lg font-medium text-purple-900 dark:text-purple-100">
              {student.user.email}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
              <Phone className="h-4 w-4" />
              <span>Phone</span>
            </div>
            <p className="text-lg font-medium text-purple-900 dark:text-purple-100">
              {student.user.phone || 'Not specified'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 