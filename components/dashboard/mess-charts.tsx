'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/charts/bar-chart";
import { RadialChart } from "@/components/ui/charts/radial-chart";

interface MessChartsProps {
  messRatings: {
    ratingDistribution: Record<string, number>;
    averageRating: number;
    totalFeedback: number;
  };
}

export function MessCharts({ messRatings }: MessChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Mess Ratings Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            title=""
            height={300}
            data={Object.entries(messRatings.ratingDistribution).map(([rating, count]) => ({
              rating: `${rating}`,
              value: count,
            }))}
            xAxisKey="rating"
            dataKey="value"
            config={{
              value: {
                label: "Reviews",
              },
              "1": {
                label: "1 Star",
                color: "hsl(var(--chart-1))",
              },
              "2": {
                label: "2 Stars",
                color: "hsl(var(--chart-2))",
              },
              "3": {
                label: "3 Stars",
                color: "hsl(var(--chart-3))",
              },
              "4": {
                label: "4 Stars",
                color: "hsl(var(--chart-4))",
              },
              "5": {
                label: "5 Stars",
                color: "hsl(var(--chart-5))",
              },
            }}
            activeIndex={3}
          />
        </CardContent>
      </Card>
      <RadialChart
        title="Overall Rating"
        description={`Based on ${messRatings.totalFeedback} reviews`}
        value={messRatings.averageRating}
        maxValue={5}
        label="Rating"
        config={{
          rating: {
            label: "Rating",
            color: "hsl(var(--chart-3))",
          }
        }}
      />
    </div>
  );
} 