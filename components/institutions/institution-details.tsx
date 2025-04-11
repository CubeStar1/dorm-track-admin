import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Institution } from '@/lib/api/services/institutions';
import { Building2, Mail } from 'lucide-react';

interface InstitutionDetailsProps {
  institution: Institution;
}

export function InstitutionDetails({ institution }: InstitutionDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle>Institution Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Code</p>
            <p className="font-medium">{institution.code}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-medium">{institution.address}</p>
            <p className="text-muted-foreground">
              {institution.city}, {institution.state}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <CardTitle>Contact Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{institution.contact_email}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium">{institution.contact_phone}</p>
          </div>
          {institution.website && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Website</p>
              <a
                href={institution.website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                {institution.website}
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 