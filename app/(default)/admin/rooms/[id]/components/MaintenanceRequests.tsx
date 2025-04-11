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

interface MaintenanceRequest {
  id: string;
  issue_type: string;
  description: string;
  priority: string;
  status: string;
  created_at: string;
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

interface MaintenanceRequestsProps {
  requests: MaintenanceRequest[];
}

export function MaintenanceRequests({ requests }: MaintenanceRequestsProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
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
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No maintenance requests found
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.issue_type}
                  </TableCell>
                  <TableCell>{request.description}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.student.user.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {request.student.student_id}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(request.priority)}>
                      {request.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {request.assigned_to ? (
                      <div>
                        <p className="font-medium">{request.assigned_to.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.assigned_to.email}
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
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