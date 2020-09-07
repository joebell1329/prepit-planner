import { Food, Unit } from '../api/api.model';

export type AddIngredientFormData = {
  food: Food;
  amount: number;
  unit: Unit;
  calories: number;
};
