export type DataPoint = { [key: string]: string | number } & { date: string | number };

// Add a fileName property to DataSet
export type DataSet = DataPoint[] & { fileName?: string };


export type ColumnStats = {
  mean: number;
  median: number;
  stdDev: number;
};

export type AllStats = {
  [column: string]: ColumnStats;
};

export type CorrelationMatrix = {
  [symptom: string]: {
    [factor: string]: number;
  };
};

export type AnalysisResult = {
  correlationMatrix: CorrelationMatrix;
  summary: string;
  suggestedMethods: string[];
  biasExplanations: string[];
  compensatingSteps: string[];
  statistics: {
    symptoms: AllStats;
    factors: AllStats;
  };
};
