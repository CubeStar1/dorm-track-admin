'use client';

import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

interface RadialChartProps {
  title: string;
  description?: string;
  value: number;
  maxValue?: number;
  label: string;
  className?: string;
  config: ChartConfig;
  trend?: {
    value: number;
    text: string;
  };
  footer?: string;
}

export function RadialChart({
  title,
  description,
  value,
  maxValue = 5,
  label,
  className,
  config,
  trend,
  footer,
}: RadialChartProps) {
  // Calculate percentage for the chart
  const percentage = (value / maxValue) * 100;
  
  // Create data for the chart
  const chartData = [
    {
      name: "value",
      value: percentage,
      fill: Object.values(config)[0]?.color || "hsl(var(--chart-1))"
    }
  ];

  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {description && (
          <CardDescription className="text-xs">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={140}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar
              dataKey="value"
              background
              className="stroke-background stroke-2"
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {value.toFixed(1)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          {label}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      {(trend || footer) && (
        <CardFooter className="flex-col items-center gap-2 pt-2 pb-4">
          {trend && (
            <div className="flex gap-2 font-medium leading-none">
              Trending {trend.value >= 0 ? 'up' : 'down'} by {Math.abs(trend.value)}% {trend.text}{' '}
              <TrendingUp className="h-4 w-4" />
            </div>
          )}
          {footer && (
            <div className="leading-none text-muted-foreground text-sm">
              {footer}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
} 