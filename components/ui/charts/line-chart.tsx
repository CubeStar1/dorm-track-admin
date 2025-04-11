'use client';

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart as RechartsLineChart, ResponsiveContainer, XAxis } from "recharts";
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

interface LineChartProps {
  title: string;
  description?: string;
  data: Array<Record<string, any>>;
  className?: string;
  series: Array<{
    key: string;
    label: string;
    color: string;
  }>;
  xAxisKey: string;
  height?: number;
  trend?: {
    value: number;
    text: string;
  };
  footer?: string;
}

export function LineChart({
  title,
  description,
  data,
  className,
  series,
  xAxisKey,
  height = 350,
  trend,
  footer,
}: LineChartProps) {
  const chartConfig = series.reduce((acc, { key, label, color }) => ({
    ...acc,
    [key]: {
      label,
      color,
    },
  }), {}) as ChartConfig;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={height}>
            <RechartsLineChart
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} className="stroke-muted" />
              <XAxis
                dataKey={xAxisKey}
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              {series.map(({ key }) => (
                <Line
                  key={key}
                  type="natural"
                  dataKey={key}
                  stroke={`var(--color-${key})`}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      {(trend || footer) && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {trend && (
            <div className="flex gap-2 font-medium leading-none">
              Trending {trend.value >= 0 ? 'up' : 'down'} by {Math.abs(trend.value)}% {trend.text}{' '}
              <TrendingUp className="h-4 w-4" />
            </div>
          )}
          {footer && (
            <div className="leading-none text-muted-foreground">
              {footer}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
} 