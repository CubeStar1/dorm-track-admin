'use client';

import { Area, AreaChart as RechartsAreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';

interface AreaChartProps {
  title: string;
  description?: string;
  data: Array<{ name: string; value: number }>;
  className?: string;
  valueFormatter?: (value: number) => string;
  height?: number;
}

export function AreaChart({
  title,
  description,
  data,
  className,
  valueFormatter = (value: number) => value.toString(),
  height = 350,
}: AreaChartProps) {
  const chartConfig = {
    value: {
      label: 'Value',
      color: 'hsl(var(--chart-1))',
    },
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={height}>
            <RechartsAreaChart data={data}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={valueFormatter}
              />
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <ChartTooltip />
              <Area
                dataKey="value"
                type="monotone"
                className="fill-primary/10 stroke-primary"
                fill="var(--color-value-10)"
                stroke="var(--color-value)"
              />
            </RechartsAreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 