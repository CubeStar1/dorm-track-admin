'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Warden } from '@/lib/api/services/wardens';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

type WardenListProps = {
  wardens: Warden[];
};

export function WardenList({ wardens }: WardenListProps) {
  const router = useRouter();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Employee ID</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Hostel</TableHead>
            <TableHead>Assigned Blocks</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wardens.map((warden) => (
            <TableRow key={warden.user_id}>
              <TableCell className="font-medium">
                {warden.user.full_name}
              </TableCell>
              <TableCell>{warden.employee_id}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div>{warden.user.email}</div>
                  {warden.user.phone && (
                    <div className="text-sm text-muted-foreground">
                      {warden.user.phone}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>{warden.hostel.name}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {warden.assigned_blocks.map((block) => (
                    <span
                      key={block}
                      className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100 rounded-md text-sm"
                    >
                      {block}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(warden.created_at), 'PP')}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/admin/wardens/${warden.user_id}`)}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 