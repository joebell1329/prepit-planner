export const API_BASE_URI = 'https://api.fitbit.com';

export type Food = {
  accessLevel: 'PUBLIC' | 'PRIVATE' | 'SHARED';
  calories: number;
  defaultServingSize: number;
  defaultUnit: Unit;
  foodId: number;
  locale: string;
  name: string;
  brand?: string;
  servings?: Serving[];
  units: number[];
};

export type Serving = {
  multiplier: number;
  servingSize: number;
  unit: Unit;
  unitId: number;
};

export type Unit = {
  id: number;
  name: string;
  plural: string;
};
