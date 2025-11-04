import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../../../interfaces/message';
import { MessageService } from '../../../services/message.service';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit {
  message: Message | null = null;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.messageService.message$.subscribe(msg => {
      this.message = msg;

      switch (this.message?.severity) {
        case 'info':
          this.message.icon = 'bi-info-circle';
          break;
        case 'success':
          this.message.icon = 'bi-check-circle';
          break;
        case 'warning':
          this.message.icon = 'bi-exclamation-triangle';
          break;
        case 'danger':
          this.message.icon = 'bi-x-circle';
          break;
      }
    });
  }
}
