import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { CartItem } from '../../../interfaces/cartitem';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { NumberFormatPipe } from "../../../pipes/number-format.pipe";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, NumberFormatPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  constructor(
    private api: ApiService,
    private auth: AuthService

  ) { }
  
  currency = environment.currency ;
  items: CartItem[] = [];
  alltotal: number = 0;

  ngOnInit(): void {
    this.api.selectWhere('carts_vt', 'userId', 'eq', this.auth.loggedUser()[0].id).then(res => {
      this.items = res.data as CartItem[];
      this.items.forEach(item => {
        this.alltotal += item.total;
      });
    });
  }
}
