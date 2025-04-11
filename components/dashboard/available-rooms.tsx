'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { hostelService } from "@/lib/api/services/hostels";
import { useInstitution } from "@/lib/hooks/use-institution";

interface AvailableRoomsProps {
  limit?: number;
}

export function AvailableRooms({ limit = 5 }: AvailableRoomsProps) {
  const router = useRouter();
  const { institutionId } = useInstitution();

  const { data: hostels, isLoading } = useQuery({
    queryKey: ['hostels', institutionId],
    queryFn: () => hostelService.getHostels({ institutionId }),
    enabled: !!institutionId
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Hostels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const availableHostels = hostels?.slice(0, limit) || [];

  if (availableHostels.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Hostels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">No hostels found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Hostels</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Total Blocks</TableHead>
              <TableHead>Total Rooms</TableHead>
              <TableHead>Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {availableHostels.map((hostel) => (
              <TableRow
                key={hostel.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/admin/hostels/${hostel.id}`)}
              >
                <TableCell className="font-medium">{hostel.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {hostel.code}
                  </Badge>
                </TableCell>
                <TableCell>{hostel.total_blocks}</TableCell>
                <TableCell>{hostel.total_rooms}</TableCell>
                <TableCell className="truncate max-w-[200px]">
                  {hostel.contact_email}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 