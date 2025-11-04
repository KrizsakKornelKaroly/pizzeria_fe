import { Component, Input, OnInit } from '@angular/core';
import { NavItem } from '../../../interfaces/navitem';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  @Input() title = '';
  isLoggedIn: boolean = false;
  loggedUserName: string = '';

  constructor(
    private auth: AuthService
  ) { }
  navItems : NavItem[] = []

  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe(res => {
      this.isLoggedIn = res;
      if (this.isLoggedIn){
        this.loggedUserName = this.auth.loggedUser()[0].name
      }
      this.setupMenu(res);
    });
  }

  setupMenu(isLoggedIn: boolean){ 
    this.navItems = [
      { name: 'PizzaLista', url: '/pizzalista', icon: 'database' },
      
      ...(isLoggedIn) ? [
        { name: 'Kijelentkezés', url: '/logout', icon: 'box-arrow-left' }
      ] : [
        { name: 'Regisztráció', url: '/registration', icon: 'person-add' },
        { name: 'Bejelentkezés', url: '/login', icon: 'box-arrow-in-right' }
      ]
    
    ];
  }
}
