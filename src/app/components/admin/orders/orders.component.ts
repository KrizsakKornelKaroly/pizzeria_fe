import { Component, OnInit } from '@angular/core';
import { Order } from '../../../interfaces/order';
import { ApiService } from '../../../services/api.service';
import { CommonModule} from "@angular/common";
import { NumberFormatPipe } from "../../../pipes/number-format.pipe";
import { environment } from '../../../../environments/environment';
import { TimeFormatPipe } from "../../../pipes/time-format.pipe";
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [NumberFormatPipe, TimeFormatPipe, CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  currency = environment.currency ;
  orders : Order[] = [];
  users: User[] = [];

  constructor(
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.getOrders();
    this.getUsers();  
  }

  getOrders() {
    this.api.selectAll('orders').then(res => {
      if (res.status == 200) {
        this.orders = res.data;

        this.orders.sort((a, b) => {
          if (a.status === 'pending' && b.status !== 'pending') {
            return -1;
          } else if (a.status !== 'pending' && b.status === 'pending') {
            return 1;
          } else {
            return 0;
          }
        });
      }
    });
  }

  getUsers() {
    this.api.selectAll('users').then(res => {
      if (res.status == 200) {
        this.users = res.data;
      }
    });
  }

  getUserName(userId: number): string {
    let userName = '';
    const user = this.users.find(u => u.id == userId);
    if (user) {
      userName = user.name;
    }
    return userName;
  }

  completeOrder(orderId: number) {
    let currentTime = new Date().toISOString();
    //TODO: timezone correction 
    console.log(currentTime);
    this.api.update('orders', orderId, {status: 'completed', updated_at: currentTime}).then(res => {
      if (res.status == 200) {
        this.getOrders();
      }
    });
  }

}
