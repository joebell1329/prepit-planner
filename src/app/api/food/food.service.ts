import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_BASE_URI, Food } from '../api.model';

type SearchFoodsResponse = {
  foods: Food[];
};

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http: HttpClient) { }

  public searchFoods(query: string): Observable<Food[]> {
    return this.http.get<SearchFoodsResponse>(`${API_BASE_URI}/1/foods/search.json?query=${encodeURIComponent(query)}`)
      .pipe(map(response => response.foods));
  }
}
