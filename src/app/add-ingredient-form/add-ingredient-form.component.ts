import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, shareReplay, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { Food, Unit } from '../api/api.model';
import { FoodService } from '../api/food/food.service';
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
    unit: 'unit'
  };

  public readonly ICONS = {
    faSearch
  };

  public formGroup: FormGroup;

  public foodListVisible = false;

  private componentDestroyed$ = new Subject<void>();

  public searchResults$: Observable<Food[]>;
  public allUnits$: Observable<Unit[]>;

  public filteredUnits: Unit[] = [];

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

  constructor(private formBuilder: FormBuilder, public foodService: FoodService) {
  }

  ngOnInit(): void {
    this.buildForm();
    this.setupObservables();
    this.ingredient.valueChanges.subscribe(selectedIngredient => {
      this.allUnits$
        .pipe(
          take(1)
        )
        .subscribe(units => {
          console.log(selectedIngredient);
          console.log(units.filter(unit => selectedIngredient.units.some(sUnit => sUnit === unit.id)));
          this.filteredUnits = units.filter(unit => selectedIngredient.units.some(sUnit => sUnit === unit.id));
        });
    });

    this.formGroup.statusChanges.subscribe(status => this.validityChange.emit(status === 'VALID'));
    this.formGroup.valueChanges.subscribe(() => this.valueChange.emit({
      food: this.ingredient.value,
      amount: this.amount.value,
      unit: this.unit.value
    }));
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  onFoodSelected(food: Food): void {
    this.ingredient.setValue(food);
    this.foodListVisible = false;
  }

  private buildForm(): void {
    this.formGroup = this.formBuilder.group({
      [this.FORM_KEYS.searchQuery]: [ '' ],
      [this.FORM_KEYS.ingredient]: [ null, Validators.required ],
      [this.FORM_KEYS.amount]: [ null, Validators.required ],
      [this.FORM_KEYS.unit]: [ null, Validators.required ]
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

    this.allUnits$ = this.foodService.getUnits()
      .pipe(
        tap(console.log),
        shareReplay(1)
      );
  }

}
