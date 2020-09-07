import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddIngredientFormData } from '../add-ingredient-form/add-ingredient-form.model';

@Component({
  selector: 'prepit-add-ingredient-dialog',
  templateUrl: './add-ingredient-dialog.component.html',
  styleUrls: ['./add-ingredient-dialog.component.scss']
})
export class AddIngredientDialogComponent {

  public submit = new EventEmitter<AddIngredientFormData>();

  public formIsValid = false;
  public formData: AddIngredientFormData;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddIngredientDialogComponent>) { }

  onFormValidityChange(formIsValid: boolean): void {
    this.formIsValid = formIsValid;
  }

  onFormValueChange(formData: AddIngredientFormData): void {
    this.formData = formData;
  }

}
