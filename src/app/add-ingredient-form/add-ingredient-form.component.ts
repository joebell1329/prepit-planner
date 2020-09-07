import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { debounceTime, filter, map, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { Food, Serving } from '../api/api.model';
import { FoodService } from '../api/food/food.service';
import { calculateCalories } from '../helpers/helpers';
import { AddIngredientFormData } from './add-ingredient-form.model';

@Component({
  selector: 'prepit-add-ingredient-form',
  templateUrl: './add-ingredient-form.component.html',
  styleUrls: [ './add-ingredient-form.component.scss' ]
})
export class AddIngredientFormComponent implements OnInit, OnDestroy {

  @Output() validityChange = new EventEmitter<boolean>();
  @Output() valueChange = new EventEmitter<AddIngredientFormData>();

  public readonly FORM_KEYS = {
    searchQuery: 'searchQuery',
    ingredient: 'ingredient',
    amount: 'amount',
    unit: 'unit',
    calories: 'calories'
  };

  public readonly ICONS = {
    faSearch
  };

  public formGroup: FormGroup;

  public foodListVisible = false;

  private componentDestroyed$ = new Subject<void>();

  public searchResults$: Observable<Food[]>;

  public get searchQuery(): FormControl {
    return this.formGroup?.get(this.FORM_KEYS.searchQuery) as FormControl;
  }

  public get ingredient(): FormControl {
    return this.formGroup?.get(this.FORM_KEYS.ingredient) as FormControl;
  }

  public get amount(): FormControl {
    return this.formGroup?.get(this.FORM_KEYS.amount) as FormControl;
  }

  public get unit(): FormControl {
    return this.formGroup?.get(this.FORM_KEYS.unit) as FormControl;
  }

  public get calories(): FormControl {
    return this.formGroup?.get(this.FORM_KEYS.calories) as FormControl;
  }

  constructor(private formBuilder: FormBuilder, public foodService: FoodService) {
  }

  ngOnInit(): void {
    this.buildForm();
    this.setupObservables();

    this.formGroup.statusChanges.subscribe(status => this.validityChange.emit(status === 'VALID'));
    this.formGroup.valueChanges
      .pipe(filter(() => this.formGroup.valid))
      .subscribe(() => this.valueChange.emit({
        food: this.ingredient.value,
        amount: this.amount.value,
        unit: this.unit.value,
        calories: this.calories.value
      }));
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  onFoodSelected(food: Food): void {
    this.foodService.getFood(food.foodId)
      .subscribe(fullFood => {
        this.ingredient.setValue(fullFood);
        this.foodListVisible = false;
      });
  }

  private buildForm(): void {
    this.formGroup = this.formBuilder.group({
      [this.FORM_KEYS.searchQuery]: [ '' ],
      [this.FORM_KEYS.ingredient]: [ null, Validators.required ],
      [this.FORM_KEYS.amount]: [ null, Validators.required ],
      [this.FORM_KEYS.unit]: [ null, Validators.required ],
      [this.FORM_KEYS.calories]: [ null ]
    });
  }

  private setupObservables(): void {
    this.searchResults$ = this.searchQuery.valueChanges
      .pipe(
        takeUntil(this.componentDestroyed$),
        debounceTime(500),
        switchMap(query => query.length ? this.foodService.searchFoods(query) : of(null)),
        shareReplay(1)
      );

    combineLatest([ this.amount.valueChanges, this.unit.valueChanges ])
      .pipe(
        takeUntil(this.componentDestroyed$),
        map(() => {
          if (this.amount.value > 0 && this.unit.value) {
            const servingConfig: Serving = this.ingredient.value.servings
              .find((serving: Serving) => serving.unitId === this.unit.value.id);

            const defaultCalories: number = this.ingredient.value.calories;

            return calculateCalories(defaultCalories, servingConfig, this.amount.value);
          } else {
            return 0;
          }
        })
      )
      .subscribe(calories => this.calories.setValue(calories));
  }
}
