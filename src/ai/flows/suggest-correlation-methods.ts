'use server';

/**
 * @fileOverview A flow that suggests appropriate statistical correlation methods based on the types of symptom and environmental factor data.
 *
 * - suggestCorrelationMethods - A function that suggests correlation methods.
 * - SuggestCorrelationMethodsInput - The input type for the suggestCorrelationMethods function.
 * - SuggestCorrelationMethodsOutput - The return type for the suggestCorrelationMethods function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCorrelationMethodsInputSchema = z.object({
  symptomType: z
    .string()
    .describe('The type of symptom data (e.g., numeric, categorical, ordinal).'),
  environmentalFactorType: z
    .string()
    .describe(
      'The type of environmental factor data (e.g., numeric, categorical, ordinal).'
    ),
});
export type SuggestCorrelationMethodsInput = z.infer<
  typeof SuggestCorrelationMethodsInputSchema
>;

const SuggestCorrelationMethodsOutputSchema = z.object({
  suggestedMethods: z
    .array(z.string())
    .describe(
      'An array of suggested statistical correlation methods, appropriate for the given data types.'
    ),
  biasExplanations: z
    .array(z.string())
    .describe(
      'Explanations of the biases associated with each suggested method.'
    ),
  compensatingSteps: z
    .array(z.string())
    .describe(
      'Necessary compensating steps to ensure the validity of the correlation analysis.'
    ),
});
export type SuggestCorrelationMethodsOutput = z.infer<
  typeof SuggestCorrelationMethodsOutputSchema
>;

export async function suggestCorrelationMethods(
  input: SuggestCorrelationMethodsInput
): Promise<SuggestCorrelationMethodsOutput> {
  return suggestCorrelationMethodsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCorrelationMethodsPrompt',
  input: {schema: SuggestCorrelationMethodsInputSchema},
  output: {schema: SuggestCorrelationMethodsOutputSchema},
  prompt: `You are an expert statistician specializing in correlation analysis.

You will suggest appropriate statistical correlation methods based on the types of symptom and environmental factor data provided.

Explain the biases associated with each suggested method and suggest necessary compensating steps to ensure the validity of the correlation analysis.

Symptom Data Type: {{{symptomType}}}
Environmental Factor Data Type: {{{environmentalFactorType}}}

Respond in JSON format.
`,
});

const suggestCorrelationMethodsFlow = ai.defineFlow(
  {
    name: 'suggestCorrelationMethodsFlow',
    inputSchema: SuggestCorrelationMethodsInputSchema,
    outputSchema: SuggestCorrelationMethodsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
