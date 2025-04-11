'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Warden } from '@/lib/api/services/wardens';
import { format } from 'date-fns';
import { 
  Building2, 
  Mail, 
  Phone, 
  User, 
  Calendar,
  Shield,
  Blocks
} from 'lucide-react';

type WardenDetailsProps = {
  warden: Warden;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function WardenDetails({ warden, onEdit, onDelete }: WardenDetailsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Warden Overview Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-2 border-blue-200 dark:border-blue-800">
          <CardHeader className="border-b border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-blue-900 dark:text-blue-100">Warden Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <User className="h-4 w-4" />
                  <span>Name</span>
                </div>
                <p className="text-lg font-medium text-blue-900 dark:text-blue-100">
                  {warden.user.full_name}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <Shield className="h-4 w-4" />
                  <span>Employee ID</span>
                </div>
                <p className="text-lg font-medium text-blue-900 dark:text-blue-100">
                  {warden.employee_id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Card */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-2 border-indigo-200 dark:border-indigo-800">
          <CardHeader className="border-b border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <CardTitle className="text-indigo-900 dark:text-indigo-100">Contact Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </div>
                <p className="text-lg font-medium text-indigo-900 dark:text-indigo-100">
                  {warden.user.email}
                </p>
              </div>

              {warden.user.phone && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
                    <Phone className="h-4 w-4" />
                    <span>Phone</span>
                  </div>
                  <p className="text-lg font-medium text-indigo-900 dark:text-indigo-100">
                    {warden.user.phone}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Hostel Information Card */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-2 border-purple-200 dark:border-purple-800">
          <CardHeader className="border-b border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <CardTitle className="text-purple-900 dark:text-purple-100">Hostel Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                  <Building2 className="h-4 w-4" />
                  <span>Hostel</span>
                </div>
                <p className="text-lg font-medium text-purple-900 dark:text-purple-100">
                  {warden.hostel.name}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                  <Blocks className="h-4 w-4" />
                  <span>Assigned Blocks</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {warden.assigned_blocks.map((block) => (
                    <span
                      key={block}
                      className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100 rounded-md text-sm"
                    >
                      {block}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Sidebar */}
      <div className="space-y-6">
        {/* Timeline Card */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-2 border-amber-200 dark:border-amber-800">
          <CardHeader className="border-b border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <CardTitle className="text-amber-900 dark:text-amber-100">Timeline</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                  <Calendar className="h-4 w-4" />
                  <span>Created On</span>
                </div>
                <p className="text-lg font-medium text-amber-900 dark:text-amber-100">
                  {format(new Date(warden.created_at), 'PPpp')}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                  <Calendar className="h-4 w-4" />
                  <span>Last Updated</span>
                </div>
                <p className="text-lg font-medium text-amber-900 dark:text-amber-100">
                  {format(new Date(warden.updated_at), 'PPpp')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {onEdit && (
              <Button
                variant="outline"
                className="w-full"
                onClick={onEdit}
              >
                Edit Warden
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                className="w-full"
                onClick={onDelete}
              >
                Delete Warden
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 