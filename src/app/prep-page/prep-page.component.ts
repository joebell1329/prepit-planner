import { CommonModule } from '@angular/common';
import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { Food } from '../api/api.model';
import { FoodService } from '../api/food/food.service';

@Component({
  selector: 'prepit-prep-page',
  templateUrl: './prep-page.component.html',
  styleUrls: ['./prep-page.component.scss']
})
export class PrepPageComponent implements OnInit, OnDestroy {

  private componentDestroyed$ = new Subject<void>();

  public searchControl = new FormControl();

  public searchResults$: Observable<Food[]>;

  constructor(private foodService: FoodService) { }

  ngOnInit(): void {
    this.searchResults$ = this.searchControl.valueChanges
      .pipe(
        takeUntil(this.componentDestroyed$),
        debounceTime(1000),
        filter(query => !!query),
        switchMap(query => this.foodService.searchFoods(query)),
        shareReplay(1)
      );
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

}

@NgModule({
  declarations: [ PrepPageComponent ],
  imports: [ ReactiveFormsModule, CommonModule ],
  exports: [ PrepPageComponent ]
})
export class PrepPageModule { }
