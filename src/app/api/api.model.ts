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

export enum MealType {
  BREAKFAST = 1,
  MORNING_SNACK,
  LUNCH,
  AFTERNOON_SNACK,
  DINNER,
  ANY_TIME
}

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

export type FoodLog = {
  isFavorite: boolean;
  logDate: string;
  logId: string;
  loggedFood: Food;
  nutritionalValues: NutritionalValues;
};

export type NutritionalValues = {
  calories: number;
  carbs: number;
  fat: number;
  fiber: number;
  protien: number;
  sodium: number;
};

export type CreateFoodPayload = {
  name: string;
  brand: string;
  defaultFoodMeasurementUnitId: number;
  defaultServingSize: number;
  calories: number;
};

export type LogFoodPayload = {
  foodId: number;
  mealTypeId: MealType;
  unitId: number;
  amount: number;
  date: Date;
};

export type SearchFoodsResponse = {
  foods: Food[];
};

export type GetFoodResponse = {
  food: Food;
};

export type GetUserFoodsResponse = {
  foods: Food[];
};

export type CreateFoodResponse = {
  food: Food;
};

export type LogFoodResponse = {
  foodLog: FoodLog;
};
