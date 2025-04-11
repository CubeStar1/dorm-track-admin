import { Card, CardContent } from '@/components/ui/card';
import { Hostel } from '@/lib/api/services/institutions';
import { Shield, Mail, Phone, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface InstitutionWardensProps {
  hostels: Hostel[];
}

export function InstitutionWardens({ hostels }: InstitutionWardensProps) {
  const router = useRouter();

  const handleWardenClick = (userId: string) => {
    router.push(`/admin/wardens/${userId}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Shield className="h-5 w-5" />
        Wardens
      </h2>
      <Card>
        <CardContent className="py-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Name</th>
                  <th className="text-left py-2 px-4">Employee ID</th>
                  <th className="text-left py-2 px-4">Hostel</th>
                  <th className="text-left py-2 px-4">Assigned Blocks</th>
                  <th className="text-left py-2 px-4">Contact</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {hostels.flatMap(hostel =>
                  hostel.wardens.map(warden => (
                    <tr 
                      key={warden.user_id} 
                      className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleWardenClick(warden.user_id)}
                    >
                      <td className="py-2 px-4 font-medium">{warden.user.full_name}</td>
                      <td className="py-2 px-4">{warden.employee_id}</td>
                      <td className="py-2 px-4">{hostel.name}</td>
                      <td className="py-2 px-4">
                        {warden.assigned_blocks.length > 0 
                          ? warden.assigned_blocks.join(', ')
                          : 'No blocks assigned'}
                      </td>
                      <td className="py-2 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{warden.user.email}</span>
                          </div>
                          {warden.user.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{warden.user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 