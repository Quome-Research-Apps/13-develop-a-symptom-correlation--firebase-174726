'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ListTree, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface MethodologyTabProps {
  suggestedMethods: string[];
  biasExplanations: string[];
  compensatingSteps: string[];
}

export default function MethodologyTab({
  suggestedMethods,
  biasExplanations,
  compensatingSteps,
}: MethodologyTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <ListTree className="h-6 w-6" />
            <CardTitle>AI-Powered Statistical Methodology</CardTitle>
        </div>
        <CardDescription>
          Based on the types of data you provided, our AI has suggested the following statistical approaches, along with potential biases and steps to ensure the validity of your analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Suggested Methods
                </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-2 pl-6 text-base">
                {suggestedMethods.map((method, index) => (
                  <li key={index}>{method}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-accent" />
                    Potential Biases
                </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-2 pl-6 text-base">
                {biasExplanations.map((bias, index) => (
                  <li key={index}>{bias}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    Compensating Steps
                </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-2 pl-6 text-base">
                {compensatingSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
