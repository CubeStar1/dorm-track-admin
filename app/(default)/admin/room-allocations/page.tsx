'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomAllocationService } from '@/lib/api/services/room-allocations';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, CheckCircle2, Users } from 'lucide-react';

export default function RoomAllocationsPage() {
  const queryClient = useQueryClient();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const { data: allocations, isLoading: allocationsLoading } = useQuery({
    queryKey: ['room-allocations'],
    queryFn: () => roomAllocationService.getAllocations(),
  });

  const { data: unassignedStudents, isLoading: studentsLoading } = useQuery({
    queryKey: ['unassigned-students'],
    queryFn: () => roomAllocationService.getUnassignedStudents(),
  });

  const { data: availableRooms, isLoading: roomsLoading } = useQuery({
    queryKey: ['available-rooms'],
    queryFn: () => roomAllocationService.getAvailableRooms(),
  });

  const assignRoomMutation = useMutation({
    mutationFn: (data: {
      student_id: string;
      room_id: string;
      hostel_id: string;
      start_date: string;
    }) => roomAllocationService.assignRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room-allocations'] });
      queryClient.invalidateQueries({ queryKey: ['unassigned-students'] });
      queryClient.invalidateQueries({ queryKey: ['available-rooms'] });
      toast.success('Room assigned successfully');
      setSelectedStudent(null);
      setSelectedRoom(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const autoAssignMutation = useMutation({
    mutationFn: () => roomAllocationService.autoAssignRooms(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['room-allocations'] });
      queryClient.invalidateQueries({ queryKey: ['unassigned-students'] });
      queryClient.invalidateQueries({ queryKey: ['available-rooms'] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleAssignRoom = () => {
    if (!selectedStudent || !selectedRoom) return;

    const room = availableRooms?.find((r) => r.id === selectedRoom);
    if (!room) return;

    assignRoomMutation.mutate({
      student_id: selectedStudent,
      room_id: selectedRoom,
      hostel_id: room.hostel.id,
      start_date: new Date().toISOString(),
    });
  };

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Room Allocations</h1>
          <p className="text-gray-600">Manage student room assignments</p>
        </div>
        <Button
          onClick={() => autoAssignMutation.mutate()}
          disabled={autoAssignMutation.isPending}
        >
          Auto Assign All Rooms
        </Button>
      </div>

      <Tabs defaultValue="allocations">
        <TabsList className="mb-4">
          <TabsTrigger value="allocations">Current Allocations</TabsTrigger>
          <TabsTrigger value="unassigned">Unassigned Students</TabsTrigger>
          <TabsTrigger value="rooms">Available Rooms</TabsTrigger>
        </TabsList>

        <TabsContent value="allocations">
          <Card>
            <CardHeader>
              <CardTitle>Current Allocations</CardTitle>
              <CardDescription>
                View all current room allocations and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allocationsLoading ? (
                <div>Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Hostel</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allocations?.map((allocation) => (
                      <TableRow key={allocation.id}>
                        <TableCell>
                          {allocation.student?.user.full_name}
                        </TableCell>
                        <TableCell>
                          Room {allocation.room?.room_number}, Block{' '}
                          {allocation.room?.block}
                        </TableCell>
                        <TableCell>{allocation.hostel?.name}</TableCell>
                        <TableCell>
                          {format(new Date(allocation.start_date), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              allocation.status === 'active'
                                ? 'bg-green-500'
                                : allocation.status === 'completed'
                                ? 'bg-blue-500'
                                : 'bg-red-500'
                            }
                          >
                            {allocation.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unassigned">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Unassigned Students</CardTitle>
                  <CardDescription>
                    Students who haven't been assigned a room yet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {studentsLoading ? (
                    <div>Loading...</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Student ID</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Year</TableHead>
                          <TableHead className="w-[100px]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {unassignedStudents?.map((student) => (
                          <TableRow key={student.user_id}>
                            <TableCell>{student.user.full_name}</TableCell>
                            <TableCell>{student.student_id}</TableCell>
                            <TableCell>{student.department}</TableCell>
                            <TableCell>{student.year_of_study}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedStudent(student.user_id)}
                              >
                                Select
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Assign Room</CardTitle>
                <CardDescription>
                  Select a student and room to make an assignment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Selected Student</label>
                  <div className="p-3 rounded-lg bg-muted">
                    {selectedStudent ? (
                      unassignedStudents?.find(
                        (s) => s.user_id === selectedStudent
                      )?.user.full_name
                    ) : (
                      <span className="text-muted-foreground">
                        No student selected
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Room</label>
                  <Select
                    value={selectedRoom || ''}
                    onValueChange={setSelectedRoom}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRooms?.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          Room {room.room_number}, Block {room.block} -{' '}
                          {room.hostel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full"
                  disabled={!selectedStudent || !selectedRoom}
                  onClick={handleAssignRoom}
                >
                  Assign Room
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rooms">
          <Card>
            <CardHeader>
              <CardTitle>Available Rooms</CardTitle>
              <CardDescription>
                View all available rooms and their current occupancy
              </CardDescription>
            </CardHeader>
            <CardContent>
              {roomsLoading ? (
                <div>Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room Number</TableHead>
                      <TableHead>Block</TableHead>
                      <TableHead>Hostel</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Occupancy</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availableRooms?.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell>{room.room_number}</TableCell>
                        <TableCell>{room.block}</TableCell>
                        <TableCell>{room.hostel.name}</TableCell>
                        <TableCell>{room.room_type}</TableCell>
                        <TableCell>
                          {room.current_occupancy}/{room.capacity}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              room.current_occupancy === 0
                                ? 'bg-green-500'
                                : room.current_occupancy < room.capacity
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }
                          >
                            {room.current_occupancy === 0
                              ? 'EMPTY'
                              : room.current_occupancy === room.capacity
                              ? 'FULL'
                              : 'PARTIAL'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 