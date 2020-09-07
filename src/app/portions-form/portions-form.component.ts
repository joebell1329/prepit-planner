import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { PortionsFormData } from './portions-form.model';

@Component({
  selector: 'prepit-portions-form',
  templateUrl: './portions-form.component.html',
  styleUrls: [ './portions-form.component.scss' ]
})
export class PortionsFormComponent implements OnInit {

  @Output() validityChange = new EventEmitter<boolean>();
  @Output() valueChange = new EventEmitter<PortionsFormData>();

  public readonly FORM_KEYS = {
    cookedWeight: 'cookedWeight',
    targetAmount: 'targetAmount',
    targetType: 'targetType'
  };

  public formGroup: FormGroup;

  public get cookedWeight(): FormControl {
    return this.formGroup?.get(this.FORM_KEYS.cookedWeight) as FormControl;
  }

  public get targetAmount(): FormControl {
    return this.formGroup?.get(this.FORM_KEYS.targetAmount) as FormControl;
  }

  public get targetType(): FormControl {
    return this.formGroup?.get(this.FORM_KEYS.targetType) as FormControl;
  }

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.buildForm();

    this.formGroup.statusChanges.subscribe(status => this.validityChange.emit(status === 'VALID'));
    this.formGroup.valueChanges
      .pipe(filter(() => this.formGroup.valid))
      .subscribe(() => this.valueChange.emit({
        cookedWeight: this.cookedWeight.value,
        targetAmount: this.targetAmount.value,
        targetType: this.targetType.value
      }));
  }

  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      [this.FORM_KEYS.cookedWeight]: [ null, Validators.required ],
      [this.FORM_KEYS.targetAmount]: [ null, Validators.required ],
      [this.FORM_KEYS.targetType]: [ 'calories', Validators.required ]
    });
  }

}
