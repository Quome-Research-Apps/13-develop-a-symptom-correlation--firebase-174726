'use client';

import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileUp, TestTube, Wind } from 'lucide-react';

interface FileImporterProps {
  symptomFileName: string;
  envFileName: string;
  onSymptomFileSelect: (file: File) => void;
  onEnvFileSelect: (file: File) => void;
}

export default function FileImporter({
  symptomFileName,
  envFileName,
  onSymptomFileSelect,
  onEnvFileSelect,
}: FileImporterProps) {
  const symptomInputRef = useRef<HTMLInputElement>(null);
  const envInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    callback: (file: File) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      callback(file);
    }
  };

  return (
    <div className="p-2 space-y-4">
      <Card className="bg-card/50">
        <CardHeader className="p-4">
            <div className="flex items-center gap-2">
                <TestTube className="h-5 w-5 text-primary"/>
                <CardTitle className="text-base font-semibold">Symptom Data</CardTitle>
            </div>
            <CardDescription className="text-xs group-data-[collapsible=icon]:hidden">
                CSV with dates & symptom scores.
            </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Input
            id="symptom-file"
            type="file"
            accept=".csv"
            className="hidden"
            ref={symptomInputRef}
            onChange={(e) => handleFileSelect(e, onSymptomFileSelect)}
          />
          <Button
            variant="outline"
            className="w-full justify-start text-left group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-2"
            onClick={() => symptomInputRef.current?.click()}
          >
            <FileUp className="mr-2 h-4 w-4" />
            <span className="truncate group-data-[collapsible=icon]:hidden">{symptomFileName}</span>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card/50">
        <CardHeader className="p-4">
            <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-primary"/>
                <CardTitle className="text-base font-semibold">Factor Data</CardTitle>
            </div>
            <CardDescription className="text-xs group-data-[collapsible=icon]:hidden">
                CSV with dates & factor values.
            </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Input
            id="env-file"
            type="file"
            accept=".csv"
            className="hidden"
            ref={envInputRef}
            onChange={(e) => handleFileSelect(e, onEnvFileSelect)}
          />
           <Button
            variant="outline"
            className="w-full justify-start text-left group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-2"
            onClick={() => envInputRef.current?.click()}
          >
            <FileUp className="mr-2 h-4 w-4" />
            <span className="truncate group-data-[collapsible=icon]:hidden">{envFileName}</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
