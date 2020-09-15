import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { SaveFoodFormData } from './save-food-form.model';

@Component({
  selector: 'prepit-save-food-form',
  templateUrl: './save-food-form.component.html',
  styleUrls: ['./save-food-form.component.scss']
})
export class SaveFoodFormComponent implements OnInit {

  @Output() validityChange = new EventEmitter<boolean>();
  @Output() valueChange = new EventEmitter<SaveFoodFormData>();

  public readonly FORM_KEYS = {
    name: 'name',
    brand: 'brand'
  };

  public formGroup: FormGroup;

  public get name(): FormControl {
    return this.formGroup?.get(this.FORM_KEYS.name) as FormControl;
  }

  public get brand(): FormControl {
    return this.formGroup?.get(this.FORM_KEYS.brand) as FormControl;
  }

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();

    this.formGroup.statusChanges.subscribe(status => this.validityChange.emit(status === 'VALID'));
    this.formGroup.valueChanges
      .pipe(filter(() => this.formGroup.valid))
      .subscribe(() => this.valueChange.emit({
        name: this.name.value,
        brand: this.brand.value
      }));
  }

  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      [this.FORM_KEYS.name]: [ null, Validators.required ],
      [this.FORM_KEYS.brand]: [ null, Validators.required ]
    });
  }

}
