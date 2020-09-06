import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { Food } from '../api/api.model';

@Component({
  selector: 'prepit-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss']
})
export class FoodListComponent {

  @Input() foods: Food[];
  @Output() foodSelect = new EventEmitter<Food>();

  @ViewChild('foodsList') foodsList: MatSelectionList;

  onFoodSelected(food: Food): void {
    if (food) {
      this.foodSelect.emit(food);
    }
  }

}
