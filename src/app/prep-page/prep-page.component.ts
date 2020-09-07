import { CommonModule } from '@angular/common';
import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { AddIngredientDialogComponent } from '../add-ingredient-dialog/add-ingredient-dialog.component';
import { AddIngredientFormData } from '../add-ingredient-form/add-ingredient-form.model';
import { Food } from '../api/api.model';
import { FoodService } from '../api/food/food.service';
import { PortionsFormData } from '../portions-form/portions-form.model';

@Component({
  selector: 'prepit-prep-page',
  templateUrl: './prep-page.component.html',
  styleUrls: ['./prep-page.component.scss']
})
export class PrepPageComponent implements OnInit, OnDestroy {

  private componentDestroyed$ = new Subject<void>();

  public readonly ICONS = {
    faPlus
  };

  public addedFoods: AddIngredientFormData[] = [];
  public portionsData: PortionsFormData;
  public totalCalories: number;
  public caloriesPerPortion: number;
  public caloriesPerHundredGrams: number;
  public portionSize: number;
  public portionCount: number;

  public searchControl = new FormControl();

  public searchResults$: Observable<Food[]>;

  constructor(private foodService: FoodService, private dialog: MatDialog) { }

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

  onAddIngredientClick(): void {
    const dialogRef = this.dialog.open(AddIngredientDialogComponent, {
      width: '80%',
      maxWidth: '800px',
      panelClass: 'grey-container'
    });

    dialogRef.componentInstance.submit.subscribe(addedFood => this.addedFoods.push(addedFood));
  }

  public onPortionsFormValueChanged(portionsData: PortionsFormData): void {
    if (this.addedFoods?.length) {
      this.portionsData = portionsData;
      this.getSummary();
    }
  }

  private getSummary(): void {
    this.totalCalories = this.addedFoods
      .map(ingredient => ingredient.calories)
      .reduce((acc, value) => acc + value, 0);

    switch (this.portionsData.targetType) {
      case 'calories':
        this.portionCount = Math.round(this.totalCalories / this.portionsData.targetAmount);
        break;
      case 'servings':
        this.portionCount = Math.round(this.portionsData.targetAmount);
        break;
    }

    this.portionSize = Math.round(this.portionsData.cookedWeight / this.portionCount);
    this.caloriesPerPortion = Math.round((this.totalCalories / this.portionsData.cookedWeight) * this.portionSize );
    this.caloriesPerHundredGrams = Math.round((this.totalCalories / this.portionsData.cookedWeight) * 100);
  }

}
