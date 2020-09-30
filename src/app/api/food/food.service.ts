import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { API_BASE_URI, CreateFoodPayload, CreateFoodResponse, Food, FoodLog, GetFoodResponse, GetUserFoodsResponse, LogFoodPayload, LogFoodResponse, SearchFoodsResponse, Unit } from '../api.model';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  public getFood(foodId: number): Observable<Food> {
    return this.http.get<GetFoodResponse>(`${API_BASE_URI}/1/foods/${foodId}.json`)
      .pipe(map(response => response.food));
  }

  public getUserFoods(): Observable<Food[]> {
    return this.auth.fitbitUserId$
      .pipe(
        take(1),
        switchMap(userId => this.http.get<GetUserFoodsResponse>(`${API_BASE_URI}/1/user/${userId}/foods.json`)),
        map(response => response.foods)
      );
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

  public createFood(foodDetails: CreateFoodPayload): Observable<Food> {
    const body = new HttpParams()
      .set('name', foodDetails.name)
      .set('brand', foodDetails.brand)
      .set('calories', foodDetails.calories.toString())
      .set('defaultServingSize', foodDetails.defaultServingSize.toString())
      .set('defaultFoodMeasurementUnitId', foodDetails.defaultFoodMeasurementUnitId.toString());

    return this.auth.fitbitUserId$
      .pipe(
        take(1),
        switchMap(userId => this.http.post<CreateFoodResponse>(
          `${API_BASE_URI}/1/user/${userId}/foods.json`,
          body
        )),
        map(response => response.food)
      );
  }

  public logFood(payload: LogFoodPayload): Observable<FoodLog> {
    const body = new HttpParams()
      .set('foodId', payload.foodId.toString())
      .set('mealTypeId', payload.mealTypeId.toString())
      .set('unitId', payload.unitId.toString())
      .set('amount', payload.amount.toString())
      .set('date', payload.date.toISOString());

    return this.auth.fitbitUserId$
      .pipe(
        take(1),
        switchMap(userId => this.http.post<LogFoodResponse>(
          `${API_BASE_URI}/1/user/${userId}/foods/log.json`,
          body
        )),
        map(response => response.foodLog)
      );
  }
}
