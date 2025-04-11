import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Complaint {
  id: string;
  complaint_type: string;
  description: string;
  severity: string;
  status: string;
  is_anonymous: boolean;
  created_at: string;
  resolution_notes?: string;
  student: {
    student_id: string;
    user: {
      full_name: string;
      email: string;
    };
  };
  assigned_to?: {
    id: string;
    full_name: string;
    email: string;
  };
}

interface ComplaintsProps {
  complaints: Complaint[];
}

export function Complaints({ complaints }: ComplaintsProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'investigating':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'dismissed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complaints</CardTitle>
      </CardHeader>
      <CardContent>
        {complaints.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No complaints found
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-medium">
                    {complaint.complaint_type}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{complaint.description}</p>
                      {complaint.resolution_notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Resolution: {complaint.resolution_notes}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {complaint.is_anonymous ? (
                      <span className="text-muted-foreground">Anonymous</span>
                    ) : (
                      <div>
                        <p className="font-medium">{complaint.student.user.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {complaint.student.student_id}
                        </p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(complaint.severity)}>
                      {complaint.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(complaint.status)}>
                      {complaint.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {complaint.assigned_to ? (
                      <div>
                        <p className="font-medium">{complaint.assigned_to.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {complaint.assigned_to.email}
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
} 