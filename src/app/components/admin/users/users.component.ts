import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user';
import { CommonModule } from "@angular/common";
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { TimeFormatPipe } from "../../../pipes/time-format.pipe";
import { Order } from '../../../interfaces/order';

declare var bootstrap: any;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TimeFormatPipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {


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

  userInfoModal: any;
  users: User[] = [];

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
    this.userInfoModal = new bootstrap.Modal('#userInfoModal');
  }


  getUsers() {
    this.api.selectAll('users').then(res => {
      this.users = res.data;
      this.totalPages = Math.ceil(this.users.length / this.pageSize);
      this.setPage(1);
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
    
  }
}
