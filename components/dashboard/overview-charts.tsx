'use client';

import { LineChart } from "@/components/ui/charts/line-chart";
import { PieChart } from "@/components/ui/charts/pie-chart";

interface OverviewChartsProps {
  occupancyTrend: Array<{
    date: string;
    occupancy: number;
  }>;
  roomTypeDistribution: Record<string, number>;
}

export function OverviewCharts({ occupancyTrend, roomTypeDistribution }: OverviewChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <LineChart
        className="col-span-4"
        title="Occupancy Trend"
        description="Room occupancy over the last 30 days"
        data={occupancyTrend.map(({ date, occupancy }) => ({
          month: new Date(date).toLocaleDateString(),
          occupancy
        }))}
        xAxisKey="month"
        series={[
          {
            key: "occupancy",
            label: "Occupancy",
            color: "hsl(var(--chart-1))"
          }
        ]}
        trend={{
          value: 5.2,
          text: "this month"
        }}
        footer="Room occupancy rate over time"
      />
      <PieChart
        className="col-span-3"
        title="Room Distribution"
        description="Distribution of rooms by type"
        data={Object.entries(roomTypeDistribution).map(([name, value]) => ({
          name,
          value,
        }))}
        config={{
          single: {
            label: "Single Rooms",
            color: "hsl(var(--chart-1))",
          },
          double: {
            label: "Double Rooms",
            color: "hsl(var(--chart-2))",
          },
          triple: {
            label: "Triple Rooms",
            color: "hsl(var(--chart-3))",
          },
          quad: {
            label: "Quad Rooms",
            color: "hsl(var(--chart-4))",
          },
        }}
        totalLabel="Rooms"
      />
    </div>
  );
} 