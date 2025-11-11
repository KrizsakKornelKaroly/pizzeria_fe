import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.scss'
})
export class LightboxComponent {
  
  @Input() imageUrl : string = '';
  @Input() visible: boolean = false;
  @Output() closed = new EventEmitter<any>();

  close(){
    this.visible = false;
    this.closed.emit();
  }
}
