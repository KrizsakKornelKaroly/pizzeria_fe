import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user';
import { CommonModule } from "@angular/common";
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { TimeFormatPipe } from "../../../pipes/time-format.pipe";

declare var bootstrap: any;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TimeFormatPipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  userInfoModal: any;

  loggedInUser : User = {
    name: '',
    email: '',
    password: '',
    role: ''
  };
  users: User[] = [];

  selectedUser: User = {
    name: "test",
    email: '',
    password: '',
    role: ''
  };

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
    this.userInfoModal.show();
  }


}
