import {Component, EventEmitter, Input, NgModule, Output} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'message-details',
  templateUrl: './message-details.component.html',
  styleUrl: './message-details.component.scss'
})
export class MessageDetailsComponent {
  @Input() message: string = '';
  @Input() type: string = '';
  @Output() ocultarComponent = new EventEmitter();

  fecharComponent(){
    this.ocultarComponent.emit(true);
  }

}

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [ MessageDetailsComponent ],
  exports: [ MessageDetailsComponent ]
})
export class MessageDetailsModule { }
