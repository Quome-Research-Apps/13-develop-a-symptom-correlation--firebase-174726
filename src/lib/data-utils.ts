import type { DataPoint, DataSet, AllStats, CorrelationMatrix } from '@/types';

/**
 * Parses a CSV string into an array of objects.
 * Handles quoted fields and basic formatting.
 */
export function parseCSV(csvText: string): DataSet {
  const lines = csvText.trim().split('\n');
  const header = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const entry: DataPoint = {};
    header.forEach((key, index) => {
      const value = values[index]?.trim();
      if (value !== undefined) {
        const numValue = Number(value);
        entry[key] = isNaN(numValue) || value === '' ? value : numValue;
      }
    });
    return entry;
  });
}

/**
 * Aligns two datasets based on a common date column.
 * Assumes the first column is the date column.
 */
export function alignData(symptoms: DataSet, factors: DataSet): DataSet {
  const dateKeySymptoms = Object.keys(symptoms[0])[0];
  const dateKeyFactors = Object.keys(factors[0])[0];

  const factorMap = new Map<string, DataPoint>();
  factors.forEach(row => {
    const dateStr = String(row[dateKeyFactors]);
    const date = new Date(dateStr).toISOString().split('T')[0]; // Normalize date
    factorMap.set(date, row);
  });

  const aligned: DataSet = [];
  symptoms.forEach(symptomRow => {
    const dateStr = String(symptomRow[dateKeySymptoms]);
    const date = new Date(dateStr).toISOString().split('T')[0]; // Normalize date

    if (factorMap.has(date)) {
      const factorRow = factorMap.get(date)!;
      // Combine rows, excluding the duplicate date column from factors
      const { [dateKeyFactors]: _, ...restOfFactors } = factorRow;
      aligned.push({ ...symptomRow, ...restOfFactors, date: dateStr });
    }
  });

  return aligned;
}


function getNumericValues(data: DataSet, key: string): number[] {
    return data.map(row => Number(row[key])).filter(val => !isNaN(val) && isFinite(val));
}


/**
 * Calculates descriptive statistics for a given set of keys.
 */
export function calculateAllStats(data: DataSet, keys: string[]): AllStats {
  const allStats: AllStats = {};
  keys.forEach(key => {
    const values = getNumericValues(data, key);
    if (values.length === 0) return;

    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / values.length;

    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    const stdDev = Math.sqrt(values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length);

    allStats[key] = { mean, median, stdDev };
  });
  return allStats;
}

/**
 * Calculates the Pearson correlation coefficient between two arrays of numbers.
 */
function calculatePearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n === 0 || y.length !== n) return NaN;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.map((val, i) => val * y[i]).reduce((a, b) => a + b, 0);
  const sumX2 = x.map(val => val * val).reduce((a, b) => a + b, 0);
  const sumY2 = y.map(val => val * val).reduce((a, b) => a + b, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) return NaN;
  return numerator / denominator;
}

/**
 * Creates a correlation matrix between symptoms and factors.
 */
export function createCorrelationMatrix(data: DataSet, symptomKeys: string[], factorKeys: string[]): CorrelationMatrix {
  const matrix: CorrelationMatrix = {};

  symptomKeys.forEach(symptom => {
    matrix[symptom] = {};
    const symptomValues = getNumericValues(data, symptom);

    factorKeys.forEach(factor => {
      const factorValues = getNumericValues(data, factor);
      if (symptomValues.length === factorValues.length) {
        matrix[symptom][factor] = calculatePearsonCorrelation(symptomValues, factorValues);
      } else {
        matrix[symptom][factor] = NaN; // Handle unequal length due to missing values
      }
    });
  });

  return matrix;
}

/**
 * Gets all keys that contain numeric data from a dataset.
 */
export function getNumericKeys(data: DataSet | null): string[] {
    if (!data || data.length === 0) return [];
    const allKeys = Object.keys(data[0]);
    const dateKey = allKeys[0]; // Assume first key is date
    
    return allKeys.filter(key => 
        key !== dateKey && typeof data[0][key] === 'number'
    );
}

/**
 * Infers data types for columns.
 */
export function inferDataTypes(data: DataSet, symptomKeys: string[], factorKeys: string[]): { symptomTypes: Record<string, string>, factorTypes: Record<string, string> } {
  const checkType = (key: string) => {
    const value = data[0]?.[key];
    return typeof value === 'number' ? 'numeric' : 'categorical';
  };

  const symptomTypes = Object.fromEntries(symptomKeys.map(key => [key, checkType(key)]));
  const factorTypes = Object.fromEntries(factorKeys.map(key => [key, checkType(key)]));

  return { symptomTypes, factorTypes };
}
