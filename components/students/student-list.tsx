'use client';

import { Student } from '@/lib/api/services/students';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Building2, User } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  onViewDetails?: (id: string) => void;
}

export function StudentList({ students, onViewDetails }: StudentListProps) {
  const router = useRouter();

  const handleViewDetails = (id: string) => {
    if (onViewDetails) {
      onViewDetails(id);
    } else {
      router.push(`/admin/students/${id}`);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Hostel & Room</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{student.user.full_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {student.student_id}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {student.department || (
                  <span className="text-muted-foreground">Not specified</span>
                )}
              </TableCell>
              <TableCell>
                {student.year_of_study ? (
                  <Badge variant="outline">Year {student.year_of_study}</Badge>
                ) : (
                  <span className="text-muted-foreground">Not specified</span>
                )}
              </TableCell>
              <TableCell>
                {student.hostel ? (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{student.hostel.name}</div>
                      {student.room && (
                        <div className="text-sm text-muted-foreground">
                          Block {student.room.block} - Room {student.room.room_number}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Not allocated</span>
                )}
              </TableCell>
              <TableCell>
                {format(new Date(student.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewDetails(student.id)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 