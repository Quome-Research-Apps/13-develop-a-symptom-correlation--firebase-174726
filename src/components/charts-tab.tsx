'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ComposedChart } from 'recharts';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DataSet } from '@/types';
import { LineChart, Palette } from 'lucide-react';

interface ChartsTabProps {
  data: DataSet;
}

// Generate a color palette for the charts
const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(19, 90%, 55%)',
  'hsl(255, 67%, 51%)',
  'hsl(339, 81%, 58%)',
];

export default function ChartsTab({ data }: ChartsTabProps) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  
  const numericKeys = useMemo(() => {
    if (!data || data.length === 0) return [];
    const keys = Object.keys(data[0]);
    // Exclude the date key and non-numeric keys
    return keys.filter(key => key.toLowerCase() !== 'date' && typeof data[0][key] === 'number');
  }, [data]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: We only want this to run once
  React.useEffect(() => {
    if (numericKeys.length > 0) {
      setSelectedKeys([numericKeys[0]]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numericKeys]);
  
  const handleCheckboxChange = (key: string, checked: boolean) => {
    setSelectedKeys(prev => 
      checked ? [...prev, key] : prev.filter(k => k !== key)
    );
  };
  
  const chartData = useMemo(() => {
    return data.map(row => {
      const date = new Date(row.date as string);
      return {
        ...row,
        date: isNaN(date.getTime()) ? row.date : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      };
    });
  }, [data]);

  const chartConfig = useMemo(() => {
    const config: any = {};
    numericKeys.forEach((key, index) => {
      config[key] = {
        label: key,
        color: COLORS[index % COLORS.length],
      };
    });
    return config;
  }, [numericKeys]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <LineChart className="h-6 w-6" />
            <CardTitle>Interactive Time-Series Charts</CardTitle>
        </div>
        <CardDescription>
          Visualize symptoms and environmental factors over time. Select variables from the list below to plot them on the chart.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 h-[400px] flex flex-col">
            <CardHeader className="p-4 border-b">
                <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5"/>
                    <h4 className="font-semibold">Select Variables</h4>
                </div>
            </CardHeader>
            <ScrollArea className="flex-grow p-4">
                <div className="space-y-2">
                {numericKeys.map((key) => (
                    <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                        id={key}
                        checked={selectedKeys.includes(key)}
                        onCheckedChange={(checked) => handleCheckboxChange(key, !!checked)}
                        style={{borderColor: chartConfig[key]?.color}}
                    />
                    <Label htmlFor={key} className="text-sm" style={{color: chartConfig[key]?.color}}>{key}</Label>
                    </div>
                ))}
                </div>
            </ScrollArea>
        </Card>

        <div className="md:col-span-3">
          <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
            <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {selectedKeys.map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={chartConfig[key]?.color}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </ComposedChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
