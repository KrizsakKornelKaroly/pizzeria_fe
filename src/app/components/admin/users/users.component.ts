import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user';
import { CommonModule } from "@angular/common";
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { TimeFormatPipe } from "../../../pipes/time-format.pipe";
import { Order } from '../../../interfaces/order';
import { OrderItem } from '../../../interfaces/orderitem';
import { NumberFormatPipe } from "../../../pipes/number-format.pipe";
import { Pizza } from '../../../interfaces/pizza';
import { environment } from '../../../../environments/environment';

declare var bootstrap: any;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TimeFormatPipe, NumberFormatPipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  currency = environment.currency;

  loggedInUser: User = {
    name: '',
    email: '',
    password: '',
    role: ''
  };
  selectedUser: User = {

    name: "test",
    email: '',
    password: '',
    role: ''
  };

  selectedOrders: Order[] = [];
  selectedOrderItems: OrderItem[] = [];

  orderIdForDisplay = 0;
  userInfoModal: any;
  orderItemsModal: any;
  users: User[] = [];
  pizzas: Pizza[] = [];

  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  pagedUsers: User[] = [];

  constructor(
    private api: ApiService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.auth.loggedUser()[0];
    this.getUsers();
    this.getPizzas();
    this.userInfoModal = new bootstrap.Modal('#userInfoModal');
    this.orderItemsModal = new bootstrap.Modal('#orderItemsModal');
  }


  getUsers() {
    this.api.selectAll('users').then(res => {
      this.users = res.data;
      this.totalPages = Math.ceil(this.users.length / this.pageSize);
      this.setPage(1);
    });
  }

  getPizzas() {
    this.api.selectAll('pizzas').then(res => {
      this.pizzas = res.data;
    });
  }

  async activateUser(user: User) {
    await this.api.update('users', user.id!, { status: 1 }).then(res => {
      user.status = true;
    });
    this.getUsers();
  }

  async deactivateUser(user: User) {
    await this.api.update('users', user.id!, { status: 0 }).then(res => {
      user.status = false;
    });
    this.getUsers();
  }

  showInfo(user: User) {
    this.selectedUser = user;
    this.getOrders(user);

    this.userInfoModal.show();
  }

  hideInfo() {
    this.userInfoModal.hide();
    this.getUsers();
  }

  getOrders(user: User) {
    this.api.selectWhere('orders', 'user_id', 'eq', user.id!).then(res => {
      this.selectedOrders = res.data;
    });
  }

  setPage(page: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedUsers = this.users.slice(startIndex, endIndex);

  }

  viewOrderDetails(order: Order) {
    this.api.selectWhere('order_items', 'order_id', 'eq', order.id!).then(res => {
      this.selectedOrderItems = res.data;
      this.orderIdForDisplay = order.id!;
    });


    this.userInfoModal.hide();
    this.orderItemsModal.show();
  }

  hideOrderItemsModal() {
    this.orderItemsModal.hide();
    this.userInfoModal.show();
  }

  getPizzaName(pizzaId: number): string {
    let pizzaName = '';
    const pizza = this.pizzas.find(p => p.id == pizzaId);
    if (pizza) {
      pizzaName = pizza.name;
    }
    return pizzaName;
  }

  getPizzaDesc(pizzaId: number): string {
    let pizzaDesc = '';
    const pizza = this.pizzas.find(p => p.id == pizzaId);
    if (pizza) {
      pizzaDesc = pizza.description!;
    }
    return pizzaDesc;
  }
}