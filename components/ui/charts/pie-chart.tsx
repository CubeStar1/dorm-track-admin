'use client';

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart as RechartsPieChart, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface PieChartProps {
  title: string;
  description?: string;
  data: Array<{
    name: string;
    value: number;
    fill?: string;
  }>;
  className?: string;
  config: ChartConfig;
  trend?: {
    value: number;
    text: string;
  };
  footer?: string;
  showTotal?: boolean;
  totalLabel?: string;
}

export function PieChart({
  title,
  description,
  data,
  className,
  config,
  trend,
  footer,
  showTotal = true,
  totalLabel = "Total",
}: PieChartProps) {
  const total = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0);
  }, [data]);

  // Map the data to include fill colors from config
  const chartData = React.useMemo(() => {
    return data.map(item => ({
      ...item,
      fill: config[item.name.toLowerCase()]?.color || "hsl(var(--chart-5))"
    }));
  }, [data, config]);

  return (
    <Card className={className}>
      <CardHeader className="text-center space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {description && (
          <CardDescription className="text-xs">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="aspect-[4/3] w-full">
          <ChartContainer config={config}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="60%"
                  outerRadius="90%"
                  strokeWidth={2}
                  paddingAngle={2}
                >
                  {showTotal && (
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
                                {total.toLocaleString()}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 20}
                                className="fill-muted-foreground text-sm"
                              >
                                {totalLabel}
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  )}
                </Pie>
              </RechartsPieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
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