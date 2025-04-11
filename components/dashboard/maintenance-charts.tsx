'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/charts/bar-chart";
import { PieChart } from "@/components/ui/charts/pie-chart";
import { Wrench } from "lucide-react";

interface MaintenanceChartsProps {
  maintenanceStats: {
    pending: number;
    inProgress: number;
    completed: number;
  };
  maintenanceByType: Record<string, number>;
}

export function MaintenanceCharts({ maintenanceStats, maintenanceByType }: MaintenanceChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Maintenance Requests</CardTitle>
          <Wrench className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <BarChart
            title=""
            height={300}
            data={[
              { status: 'Pending', value: maintenanceStats.pending },
              { status: 'In Progress', value: maintenanceStats.inProgress },
              { status: 'Completed', value: maintenanceStats.completed },
            ]}
            xAxisKey="status"
            dataKey="value"
            config={{
              value: {
                label: "Requests",
              },
              Pending: {
                label: "Pending",
                color: "hsl(var(--chart-1))",
              },
              "In Progress": {
                label: "In Progress",
                color: "hsl(var(--chart-2))",
              },
              Completed: {
                label: "Completed",
                color: "hsl(var(--chart-3))",
              },
            }}
            activeIndex={1}
          />
        </CardContent>
      </Card>
      <PieChart
        title="Issues by Type"
        description="Distribution of maintenance requests by type"
        data={Object.entries(maintenanceByType).map(([name, value]) => ({
          name,
          value,
        }))}
        config={{
          plumbing: {
            label: "Plumbing",
            color: "hsl(var(--chart-1))",
          },
          electrical: {
            label: "Electrical",
            color: "hsl(var(--chart-2))",
          },
          furniture: {
            label: "Furniture",
            color: "hsl(var(--chart-3))",
          },
          cleaning: {
            label: "Cleaning",
            color: "hsl(var(--chart-4))",
          },
          other: {
            label: "Other",
            color: "hsl(var(--chart-5))",
          },
        }}
        totalLabel="Issues"
      />
    </div>
  );
} 