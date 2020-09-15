import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, filter, map, shareReplay, switchMap, take, takeUntil } from 'rxjs/operators';
import { AddIngredientDialogComponent } from '../add-ingredient-dialog/add-ingredient-dialog.component';
import { AddIngredientFormData } from '../add-ingredient-form/add-ingredient-form.model';
import { Food } from '../api/api.model';
import { FoodService } from '../api/food/food.service';
import { PortionsFormData } from '../portions-form/portions-form.model';
import { SaveFoodFormData } from '../save-food-form/save-food-form.model';

@Component({
  selector: 'prepit-prep-page',
  templateUrl: './prep-page.component.html',
  styleUrls: ['./prep-page.component.scss']
})
export class PrepPageComponent implements OnInit, OnDestroy {

  public readonly ICONS = {
    faPlus
  };

  public readonly FORM_KEYS = {
    mealDetails: 'mealDetails',
    ingredients: 'ingredients',
    portionDetails: 'portionDetails'
  };

  private componentDestroyed$ = new Subject<void>();
  public totalCalories$: Observable<number>;
  public caloriesPerHundredGrams$: Observable<number>;
  public caloriesPerPortion$: Observable<number>;
  public portionCount$: Observable<number>;
  public portionSize$: Observable<number>;

  public formGroup: FormGroup;

  public get mealDetails(): FormControl { return this.formGroup?.get(this.FORM_KEYS.mealDetails) as FormControl; }
  public get ingredients(): FormControl { return this.formGroup?.get(this.FORM_KEYS.ingredients) as FormControl; }
  public get portionDetails(): FormControl { return this.formGroup?.get(this.FORM_KEYS.portionDetails) as FormControl; }

  constructor(private foodService: FoodService, private dialog: MatDialog, private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.buildForm();
    this.initialiseObservables();
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  public onAddIngredientClick(): void {
    const dialogRef = this.dialog.open(AddIngredientDialogComponent, {
      width: '80%',
      maxWidth: '800px',
      panelClass: 'grey-container'
    });

    dialogRef.componentInstance.submit.subscribe(addedFood => {
      const ingredients = this.ingredients.value ?? [];
      this.ingredients.setValue([ ...ingredients, addedFood ]);
    });
  }

  public onPortionsFormValueChanged(portionsData: PortionsFormData): void {
    this.portionDetails.setValue(portionsData);
  }

  public onSaveFoodFormValueChanged(foodData: SaveFoodFormData): void {
    this.mealDetails.setValue(foodData);
  }

  public onSubmitMeal(): void {
    combineLatest([ this.caloriesPerPortion$, this.portionSize$ ])
      .pipe(
        take(1),
        switchMap(([ caloriesPerPortion, portionSize ]) => this.foodService.createFood({
          name: this.mealDetails.value.name,
          brand: this.mealDetails.value.brand,
          calories: caloriesPerPortion,
          defaultServingSize: portionSize,
          defaultFoodMeasurementUnitId: 147
        }))
      )
      .subscribe(result => {
        alert('Food saved, it should now be available as a custom food in the Fitbit app');
      });
  }

  private buildForm(): void {
    this.formGroup = this.formBuilder.group({
      [ this.FORM_KEYS.mealDetails ]: [ null, Validators.required ],
      [ this.FORM_KEYS.ingredients ]: [ null, Validators.required ],
      [ this.FORM_KEYS.portionDetails ]: [ null, Validators.required ]
    });
  }

  private initialiseObservables(): void {
    this.totalCalories$ = this.ingredients.valueChanges
      .pipe(
        takeUntil(this.componentDestroyed$),
        map((ingredients: AddIngredientFormData[]) => ingredients.map(i => i.calories).reduce((acc, val) => acc + val, 0)),
        shareReplay(1)
      );

    this.portionCount$ = combineLatest([ this.totalCalories$, this.portionDetails.valueChanges ])
      .pipe(
        takeUntil(this.componentDestroyed$),
        map(([ totalCalories, portionDetails ]: [ number, PortionsFormData ]) => {
          switch (portionDetails.targetType) {
          case 'calories':
            return Math.round(totalCalories / portionDetails.targetAmount);
          case 'servings':
            return Math.round(portionDetails.targetAmount);
          }
        }),
        shareReplay(1)
      );

    this.portionSize$ = combineLatest([ this.portionCount$, this.portionDetails.valueChanges ])
      .pipe(
        takeUntil(this.componentDestroyed$),
        map(([ portionCount, portionDetails ]: [ number, PortionsFormData ]) => Math.round(portionDetails.cookedWeight / portionCount)),
        shareReplay(1)
      );

    this.caloriesPerPortion$ = combineLatest([ this.totalCalories$, this.portionCount$ ])
      .pipe(
        takeUntil(this.componentDestroyed$),
        map(([ totalCalories, portionCount ]: [ number, number ]) => Math.round(totalCalories / portionCount)),
        shareReplay(1)
      );

    this.caloriesPerHundredGrams$ = combineLatest([ this.totalCalories$, this.portionDetails.valueChanges ])
      .pipe(
        takeUntil(this.componentDestroyed$),
        map(
          ([ totalCalories, portionDetails ]: [ number, PortionsFormData ]) =>
          Math.round((totalCalories / portionDetails.cookedWeight) * 100)
        ),
        shareReplay(1)
      );
  }

}
