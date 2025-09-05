'use server';

import { suggestCorrelationMethods } from '@/ai/flows/suggest-correlation-methods';
import { summarizeCorrelationInsights } from '@/ai/flows/summarize-correlation-insights';
import { 
    calculateAllStats, 
    createCorrelationMatrix, 
    inferDataTypes,
    getNumericKeys 
} from './data-utils';
import type { AnalysisResult, DataSet } from '@/types';

function formatMatrixForAI(matrix: Record<string, Record<string, number>>): string {
    const headers = ['Symptom', ...Object.keys(Object.values(matrix)[0] || {})];
    const rows = Object.entries(matrix).map(([symptom, factors]) => 
      [symptom, ...Object.values(factors).map(v => v.toFixed(4))].join(', ')
    );
    return [headers.join(', '), ...rows].join('\n');
}

export async function getCorrelationAnalysis(
    alignedData: DataSet,
    symptomData: DataSet,
    envData: DataSet
): Promise<AnalysisResult> {
  try {
    const symptomKeys = getNumericKeys(symptomData);
    const factorKeys = getNumericKeys(envData);
    
    if (symptomKeys.length === 0 || factorKeys.length === 0) {
        throw new Error("No numeric data columns found for analysis. Please check your CSV files.");
    }
    
    // Infer data types for AI - let's keep it simple for now
    const { symptomTypes, factorTypes } = inferDataTypes(alignedData, symptomKeys, factorKeys);
    const symptomTypeString = Object.values(symptomTypes).join(', ');
    const factorTypeString = Object.values(factorTypes).join(', ');

    // Calculate statistics
    const symptomStats = calculateAllStats(alignedData, symptomKeys);
    const factorStats = calculateAllStats(alignedData, factorKeys);

    // Run parallel promises for AI and local calculations
    const [methodology, correlationMatrix] = await Promise.all([
      suggestCorrelationMethods({
        symptomType: symptomTypeString || 'Not available',
        environmentalFactorType: factorTypeString || 'Not available',
      }),
      createCorrelationMatrix(alignedData, symptomKeys, factorKeys)
    ]);
    
    const matrixString = formatMatrixForAI(correlationMatrix);

    const summaryResult = await summarizeCorrelationInsights({
      correlationMatrix: matrixString,
      symptoms: symptomKeys.join(', '),
      environmentalFactors: factorKeys.join(', '),
    });

    return {
      correlationMatrix,
      summary: summaryResult.summary,
      suggestedMethods: methodology.suggestedMethods,
      biasExplanations: methodology.biasExplanations,
      compensatingSteps: methodology.compensatingSteps,
      statistics: {
        symptoms: symptomStats,
        factors: factorStats,
      },
    };
  } catch (error) {
    console.error("Error in getCorrelationAnalysis:", error);
    if (error instanceof Error) {
        throw new Error(`Analysis failed: ${error.message}`);
    }
    throw new Error('An unknown error occurred during server-side analysis.');
  }
}
