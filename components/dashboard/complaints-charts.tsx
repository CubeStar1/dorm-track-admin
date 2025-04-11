'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/charts/bar-chart";
import { PieChart } from "@/components/ui/charts/pie-chart";
import { AlertTriangle } from "lucide-react";

interface ComplaintsChartsProps {
  complaintStats: {
    pending: number;
    investigating: number;
    resolved: number;
    dismissed: number;
  };
  complaintsByType: Record<string, number>;
}

export function ComplaintsCharts({ complaintStats, complaintsByType }: ComplaintsChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Complaint Status</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <BarChart
            title=""
            height={300}
            data={[
              { status: 'Pending', value: complaintStats.pending },
              { status: 'Investigating', value: complaintStats.investigating },
              { status: 'Resolved', value: complaintStats.resolved },
              { status: 'Dismissed', value: complaintStats.dismissed },
            ]}
            xAxisKey="status"
            dataKey="value"
            config={{
              value: {
                label: "Complaints",
              },
              Pending: {
                label: "Pending",
                color: "hsl(var(--chart-1))",
              },
              Investigating: {
                label: "Investigating",
                color: "hsl(var(--chart-2))",
              },
              Resolved: {
                label: "Resolved",
                color: "hsl(var(--chart-3))",
              },
              Dismissed: {
                label: "Dismissed",
                color: "hsl(var(--chart-4))",
              },
            }}
            activeIndex={1}
          />
        </CardContent>
      </Card>
      <PieChart
        title="Complaints by Type"
        description="Distribution of complaints by category"
        data={Object.entries(complaintsByType).map(([name, value]) => ({
          name,
          value,
        }))}
        config={{
          noise: {
            label: "Noise",
            color: "hsl(var(--chart-4))",
          },
          cleanliness: {
            label: "Cleanliness",
            color: "hsl(var(--chart-3))",
          },
          security: {
            label: "Security",
            color: "hsl(var(--chart-2))",
          },
          facilities: {
            label: "Facilities",
            color: "hsl(var(--chart-1))",
          },
          other: {
            label: "Other",
            color: "hsl(var(--chart-5))",
          },
        }}
        totalLabel="Complaints"
      />
    </div>
  );
} 