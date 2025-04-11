import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminProfile } from '@/lib/api/services/profile';
import { Building2, Mail, Phone, User, UserCog } from 'lucide-react';

interface ProfileInfoProps {
  profile: AdminProfile;
}

export function ProfileInfo({ profile }: ProfileInfoProps) {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="border-2">
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>Personal Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Full Name</span>
              </div>
              <p className="text-lg font-medium">{profile.full_name}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </div>
              <p className="text-lg font-medium">{profile.email}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>Phone</span>
              </div>
              <p className="text-lg font-medium">{profile.phone || 'Not provided'}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserCog className="h-4 w-4" />
                <span>Employee ID</span>
              </div>
              <p className="text-lg font-medium">{profile.institution_admins.employee_id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Institution Information */}
      <Card className="border-2">
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle>Institution Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>Institution Name</span>
              </div>
              <p className="text-lg font-medium">{profile.institutions.name}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Contact Email</span>
              </div>
              <p className="text-lg font-medium">{profile.institutions.contact_email}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>Contact Phone</span>
              </div>
              <p className="text-lg font-medium">{profile.institutions.contact_phone}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>Location</span>
              </div>
              <p className="text-lg font-medium">
                {profile.institutions.address}, {profile.institutions.city}, {profile.institutions.state}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 