import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { CartItem } from '../../../interfaces/cartitem';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { NumberFormatPipe } from "../../../pipes/number-format.pipe";
import { MessageService } from '../../../services/message.service';
import { CartService } from '../../../services/cart.service';

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
    private auth: AuthService,
    private cart: CartService,
    private message: MessageService

  ) { }
  
  currency = environment.currency ;
  items: CartItem[] = [];
  alltotal: number = 0;

  ngOnInit(): void {
   this.getData();
  }

  getData() { 
    this.api.selectWhere('carts_vt', 'userId', 'eq', this.auth.loggedUser()[0].id).then(res => {
    this.items = res.data as CartItem[];
    this.alltotal = 0;
    this.items.forEach(item => {
      this.alltotal += item.total;
    });
  });}

  remove(id: number) {
    if (confirm("Biztosan törölni szeretnéd a terméket a kosárból?")) {
      this.api.delete('carts', id).then(res => {
        if (res.status == 500) {
          this.message.show('danger', 'Hiba!', res.message);
          return;
        }
        
        this.message.show('success', 'Siker!', 'A termék törölve lett a kosárból.');
        this.getData();
        this.cart.refreshCartCount();
      });
    }
  }

  update(item: CartItem) {
    let data = {
      amount: item.amount
    }
    this.api.update('carts', item.id, data).then(res => {
      if (res.status == 500) {
        this.message.show('danger', 'Hiba!', res.message);
        return;
      }
      this.message.show('success', 'Siker!', 'A kosár frissítve lett.');
      this.getData();
    });
  }
  
  removeAll() {
    if (confirm("Biztosan üríteni szeretnéd a kosarat?")) {
      this.api.delete('carts/userId/eq', this.auth.loggedUser()[0].id).then(res => {
        if (res.status == 500) {
          this.message.show('danger', 'Hiba!', res.message);
          return;
        }

        this.message.show('success', 'Siker!', 'A kosár ürítve lett.');
        this.getData();
        this.cart.clearCartCount();
      });
    }
  }

}
