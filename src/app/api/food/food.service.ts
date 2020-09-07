import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { API_BASE_URI, Food, Unit } from '../api.model';

type SearchFoodsResponse = {
  foods: Food[];
};

type GetFoodResponse = {
  food: Food;
};

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http: HttpClient) { }

  public getFood(foodId: number): Observable<Food> {
    return this.http.get<GetFoodResponse>(`${API_BASE_URI}/1/foods/${foodId}.json`)
      .pipe(map(response => response.food));
  }

  public getUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${API_BASE_URI}/1/foods/units.json`);
  }

  public searchFoods(query: string): Observable<Food[]> {
    return this.http.get<SearchFoodsResponse>(`${API_BASE_URI}/1/foods/search.json?query=${encodeURIComponent(query)}`)
      .pipe(
        map(response => response.foods)
      );
  }
}
