export const API_BASE_URI = 'https://api.fitbit.com';

export type Food = {
  accessLevel: 'PUBLIC' | 'PRIVATE';
  calories: number;
  defaultServingSize: number;
  defaultUnit: Unit;
  foodId: number;
  locale: string;
  name: string;
  brand?: string;
  units: number[];
};

export type Unit = {
  id: number;
  name: string;
  plural: string;
};
