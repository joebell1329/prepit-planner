import { Component, Input, NgModule, Output, EventEmitter } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'prepit-modal',
  templateUrl: './modal.component.html',
  styleUrls: [ './modal.component.scss' ]
})
export class ModalComponent {

  @Input() modalTitle: string;
  @Output() modalClose = new EventEmitter<void>();

  public readonly ICONS = {
    faTimes
  };

}

@NgModule({
  declarations: [ ModalComponent ],
  imports: [
    FontAwesomeModule
  ],
  exports: [ ModalComponent ]
})
export class ModalModule {}
