import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { User } from '../../../interfaces/user';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{

    constructor(
      private api: ApiService,
      private auth: AuthService
    ) { }

    userData : User = {
      id: 0,
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      role: '',
      reg: '',
      last: '',
      status: false
    };

    ngOnInit(): void {
      this.userData = this.auth.loggedUser();
    }

  save() { }
}
