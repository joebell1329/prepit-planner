import { Serving } from '../api/api.model';

export function calculateCalories(defaultCalories: number, serving: Serving, amount: number): number {
  const caloriesPerUnit = (defaultCalories * serving.multiplier) / serving.servingSize;
  return Math.round(caloriesPerUnit * amount);
}
