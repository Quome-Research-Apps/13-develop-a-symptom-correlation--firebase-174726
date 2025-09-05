'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SummaryTab from './summary-tab';
import ChartsTab from './charts-tab';
import StatsTab from './stats-tab';
import MethodologyTab from './methodology-tab';
import type { AnalysisResult, DataSet } from '@/types';
import { Layers, LineChart, ListTree, ClipboardList } from 'lucide-react';

interface DashboardProps {
  result: AnalysisResult;
  alignedData: DataSet;
}

export default function Dashboard({ result, alignedData }: DashboardProps) {
  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        <TabsTrigger value="summary">
          <Layers className="mr-2 h-4 w-4" />
          Summary
        </TabsTrigger>
        <TabsTrigger value="charts">
          <LineChart className="mr-2 h-4 w-4" />
          Charts
        </TabsTrigger>
        <TabsTrigger value="stats">
          <ClipboardList className="mr-2 h-4 w-4" />
          Statistics
        </TabsTrigger>
        <TabsTrigger value="methodology">
          <ListTree className="mr-2 h-4 w-4" />
          Methodology
        </TabsTrigger>
      </TabsList>
      <TabsContent value="summary">
        <SummaryTab 
            summary={result.summary} 
            correlationMatrix={result.correlationMatrix} 
            symptomKeys={Object.keys(result.statistics.symptoms)}
            factorKeys={Object.keys(result.statistics.factors)}
        />
      </TabsContent>
      <TabsContent value="charts">
        <ChartsTab data={alignedData} />
      </TabsContent>
      <TabsContent value="stats">
        <StatsTab 
            symptomStats={result.statistics.symptoms} 
            factorStats={result.statistics.factors} 
        />
      </TabsContent>
      <TabsContent value="methodology">
        <MethodologyTab
          suggestedMethods={result.suggestedMethods}
          biasExplanations={result.biasExplanations}
          compensatingSteps={result.compensatingSteps}
        />
      </TabsContent>
    </Tabs>
  );
}
