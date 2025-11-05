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
  isAdmin : boolean = false;
  loggedUserName: string = '';

  constructor(
    private auth: AuthService
  ) { }
  navItems: NavItem[] = []

  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe(res => {
      this.isLoggedIn = res;
      this.isAdmin = this.auth.isAdmin();
      if (this.isLoggedIn) {
        this.loggedUserName = this.auth.loggedUser()[0].name
      }
      this.setupMenu(res);
    });
  }

  setupMenu(isLoggedIn: boolean) {
    this.navItems = [
      { 
        name: 'PizzaLista', 
        url: '/pizzalista', 
        icon: 'database' 
      },

      ...(isLoggedIn) ? [
        {
          name: 'Kosár',
          url: '/cart',
          icon: 'cart',
          badge: 5
        },

        ...(this.isAdmin) ? [
          {
            name: 'Pizzák kezelése',
            url: '/pizzas',
            icon: 'tools'
          },
          {
            name: 'Felhasználók kezelése',
            url: '/users',
            icon: 'people'
          },
          {
            name: 'Rendelések kezelése',
            url: '/orders',
            icon: 'receipt'
          },{
            name: 'Statisztika',
            url: '/stats',
            icon: 'bar-chart'
          }
        ] : [
          {
            name: 'Rendeléseim',
            url: '/myorders',
            icon: 'receipt'
          }
        ],
        {
          name: 'Profilom',
          url: '/profile',
          icon: 'person-circle'
        },

        { 
          name: 'Kijelentkezés', 
          url: '/logout', 
          icon: 'box-arrow-left' 
        }
      ] : [
        { 
          name: 'Regisztráció',
           url: '/registration',
            icon: 'person-add' 
        },
        { 
          name: 'Bejelentkezés', 
          url: '/login', 
          icon: 'box-arrow-in-right' 
        }
      ]

    ];
  }
}
