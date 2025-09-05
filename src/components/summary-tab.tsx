'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { CorrelationMatrix } from '@/types';
import { cn } from '@/lib/utils';
import { Lightbulb, Table as TableIcon } from 'lucide-react';

interface SummaryTabProps {
  summary: string;
  correlationMatrix: CorrelationMatrix;
  symptomKeys: string[];
  factorKeys: string[];
}

function getCorrelationColor(value: number): string {
  if (isNaN(value)) return 'hsl(var(--muted))';
  
  const intensity = Math.abs(value);
  // Teal for positive, a muted red/orange for negative
  const hue = value > 0 ? 180 : 0; 
  // Use primary for positive, destructive for negative
  const colorVar = value > 0 ? '--primary' : '--destructive';

  // Opacity scales with intensity, but not linearly to make mid-values more visible
  const opacity = 0.1 + intensity * 0.9;

  return `hsl(var(${colorVar}) / ${opacity})`;
}

export default function SummaryTab({ summary, correlationMatrix, symptomKeys, factorKeys }: SummaryTabProps) {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
            <div className="flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-accent" />
                <CardTitle>AI-Generated Summary</CardTitle>
            </div>
          <CardDescription>A plain-language summary of the key findings from your data.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-base leading-relaxed">{summary}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <div className="flex items-center gap-2">
                <TableIcon className="h-6 w-6" />
                <CardTitle>Correlation Matrix</CardTitle>
            </div>
          <CardDescription>
            Visualizes the strength and direction of correlations. Teal indicates a positive correlation, red indicates a negative one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symptom</TableHead>
                    {factorKeys.map(factor => (
                      <TableHead key={factor} className="text-center">{factor}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {symptomKeys.map(symptom => (
                    <TableRow key={symptom}>
                      <TableCell className="font-medium">{symptom}</TableCell>
                      {factorKeys.map(factor => {
                        const value = correlationMatrix[symptom]?.[factor];
                        const isStrong = Math.abs(value) > 0.7;

                        return (
                          <TableCell key={factor} className="p-0">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={cn(
                                    "h-full w-full flex items-center justify-center p-4 font-mono text-center text-sm font-semibold",
                                    isStrong && "ring-2 ring-offset-2 ring-accent"
                                  )}
                                  style={{ 
                                      backgroundColor: getCorrelationColor(value),
                                      color: Math.abs(value) > 0.5 ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))'
                                  }}
                                >
                                  {value?.toFixed(2) ?? 'N/A'}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Correlation: {value?.toFixed(4) ?? 'Not calculated'}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
}
