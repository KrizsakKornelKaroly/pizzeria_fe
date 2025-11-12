import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user';
import { CommonModule} from "@angular/common";
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{

  users: User[] = [];

  constructor(
    private api: ApiService
  ) { }
  
  ngOnInit(): void {
    this.getUsers();
  }
  

  getUsers(){
    this.api.selectAll('users').then(res => {
      this.users = res.data;
    });
  }


  
  showInfo(user : User){}
}
