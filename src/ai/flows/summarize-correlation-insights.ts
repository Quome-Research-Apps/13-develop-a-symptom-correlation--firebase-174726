// Summarize the correlation insights using GenAI.

'use server';

/**
 * @fileOverview Summarizes the correlation insights between symptoms and environmental factors.
 *
 * - summarizeCorrelationInsights - A function that summarizes the correlation insights.
 * - SummarizeCorrelationInsightsInput - The input type for the summarizeCorrelationInsights function.
 * - SummarizeCorrelationInsightsOutput - The return type for the summarizeCorrelationInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCorrelationInsightsInputSchema = z.object({
  correlationMatrix: z
    .string()
    .describe('A string representation of the correlation matrix.'),
  symptoms: z.string().describe('A list of symptoms.'),
  environmentalFactors: z
    .string()
    .describe('A list of environmental factors.'),
});
export type SummarizeCorrelationInsightsInput =
  z.infer<typeof SummarizeCorrelationInsightsInputSchema>;

const SummarizeCorrelationInsightsOutputSchema = z.object({
  summary: z.string().describe('A plain-language summary of the key correlations.'),
});
export type SummarizeCorrelationInsightsOutput =
  z.infer<typeof SummarizeCorrelationInsightsOutputSchema>;

export async function summarizeCorrelationInsights(
  input: SummarizeCorrelationInsightsInput
): Promise<SummarizeCorrelationInsightsOutput> {
  return summarizeCorrelationInsightsFlow(input);
}

const summarizeCorrelationInsightsPrompt = ai.definePrompt({
  name: 'summarizeCorrelationInsightsPrompt',
  input: {schema: SummarizeCorrelationInsightsInputSchema},
  output: {schema: SummarizeCorrelationInsightsOutputSchema},
  prompt: `You are an expert data analyst specializing in summarizing complex datasets for clinical researchers and patients.

You will receive a correlation matrix, a list of symptoms, and a list of environmental factors. Your goal is to identify the most significant relationships between symptoms and environmental factors and provide a plain-language summary of the core insights.

Correlation Matrix:
{{correlationMatrix}}

Symptoms:
{{symptoms}}

Environmental Factors:
{{environmentalFactors}}

Focus on highlighting the strongest positive and negative correlations, and explain the potential implications of these relationships in an easily understandable manner. Avoid technical jargon and tailor the summary for individuals without a strong background in statistics.
`,
});

const summarizeCorrelationInsightsFlow = ai.defineFlow(
  {
    name: 'summarizeCorrelationInsightsFlow',
    inputSchema: SummarizeCorrelationInsightsInputSchema,
    outputSchema: SummarizeCorrelationInsightsOutputSchema,
  },
  async input => {
    const {output} = await summarizeCorrelationInsightsPrompt(input);
    return output!;
  }
);
