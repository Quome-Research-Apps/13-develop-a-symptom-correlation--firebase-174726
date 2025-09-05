'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { AllStats } from '@/types';
import { ClipboardList, TestTube, Wind } from 'lucide-react';

interface StatsTabProps {
  symptomStats: AllStats;
  factorStats: AllStats;
}

const StatTable = ({ title, stats, icon: Icon }: { title: string; stats: AllStats; icon: React.ElementType }) => (
    <Card>
        <CardHeader>
            <div className="flex items-center gap-2">
                <Icon className="h-5 w-5" />
                <CardTitle className="text-lg">{title}</CardTitle>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Variable</TableHead>
                    <TableHead className="text-right">Mean</TableHead>
                    <TableHead className="text-right">Median</TableHead>
                    <TableHead className="text-right">Std. Dev.</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.entries(stats).map(([key, value]) => (
                    <TableRow key={key}>
                        <TableCell className="font-medium">{key}</TableCell>
                        <TableCell className="text-right">{value.mean.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{value.median.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{value.stdDev.toFixed(2)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

export default function StatsTab({ symptomStats, factorStats }: StatsTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6" />
            <CardTitle>Descriptive Statistics</CardTitle>
        </div>
        <CardDescription>
          A statistical summary of your data, providing context for the correlation analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <StatTable title="Symptom Statistics" stats={symptomStats} icon={TestTube} />
        <StatTable title="Factor Statistics" stats={factorStats} icon={Wind} />
      </CardContent>
    </Card>
  );
}
