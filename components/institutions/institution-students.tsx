import { Card, CardContent } from '@/components/ui/card';
import { Student } from '@/lib/api/services/institutions';
import { Users, Mail, Phone, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface InstitutionStudentsProps {
  students: Student[];
}

export function InstitutionStudents({ students }: InstitutionStudentsProps) {
  const router = useRouter();

  const handleStudentClick = (userId: string) => {
    router.push(`/admin/students/${userId}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Users className="h-5 w-5" />
        Students
      </h2>
      <Card>
        <CardContent className="py-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Name</th>
                  <th className="text-left py-2 px-4">Student ID</th>
                  <th className="text-left py-2 px-4">Department</th>
                  <th className="text-left py-2 px-4">Year</th>
                  <th className="text-left py-2 px-4">Room</th>
                  <th className="text-left py-2 px-4">Contact</th>
                  <th className="w-10"></th>

                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr 
                    key={student.user_id} 
                    className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleStudentClick(student.user_id)}
                  >
                    <td className="py-2 px-4 font-medium">{student.user.full_name}</td>
                    <td className="py-2 px-4">{student.student_id}</td>
                    <td className="py-2 px-4">{student.department}</td>
                    <td className="py-2 px-4">{student.year_of_study}</td>
                    <td className="py-2 px-4">
                      <div className="space-y-1">
                        <div>{student.room?.room_number || '-'}</div>
                        <div className="text-sm text-muted-foreground">
                          {student.room?.hostel?.name || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{student.user.email}</span>
                        </div>
                        {student.user.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{student.user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-4">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 