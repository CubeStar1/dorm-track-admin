'use client';

import { TrendingUp } from "lucide-react";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, Rectangle, ResponsiveContainer, XAxis } from 'recharts';
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

interface BarChartProps {
  title: string;
  description?: string;
  data: Array<Record<string, any>>;
  className?: string;
  config: ChartConfig;
  xAxisKey: string;
  dataKey: string;
  height?: number;
  trend?: {
    value: number;
    text: string;
  };
  footer?: string;
  activeIndex?: number;
}

export function BarChart({
  title,
  description,
  data,
  className,
  config,
  xAxisKey,
  dataKey,
  height = 350,
  trend,
  footer,
  activeIndex,
}: BarChartProps) {
  // Add fill colors to the data based on config
  const chartData = data.map(item => ({
    ...item,
    fill: config[item[xAxisKey]]?.color || "hsl(var(--chart-5))"
  }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <ResponsiveContainer width="100%" height={height}>
            <RechartsBarChart data={chartData}>
              <CartesianGrid vertical={false} className="stroke-muted" />
              <XAxis
                dataKey={xAxisKey}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={12}
                stroke="#888888"
                tickFormatter={(value) =>
                  config[value]?.label || value
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey={dataKey}
                strokeWidth={2}
                radius={8}
                className="stroke-background stroke-2"
                activeIndex={activeIndex}
                activeBar={({ ...props }) => (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    stroke={props.payload.fill}
                    strokeDasharray={4}
                    strokeDashoffset={4}
                  />
                )}
              />
            </RechartsBarChart>
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