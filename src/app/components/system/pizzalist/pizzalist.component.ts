import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Pizza } from '../../../interfaces/pizza';
import { NumberFormatPipe } from "../../../pipes/number-format.pipe";
import { LightboxComponent } from '../lightbox/lightbox.component';
import { environment } from '../../../../environments/environment';
import { MessageService } from '../../../services/message.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-pizzalist',
  standalone: true,
  imports: [CommonModule, FormsModule, NumberFormatPipe, LightboxComponent],
  templateUrl: './pizzalist.component.html',
  styleUrl: './pizzalist.component.scss'
})
export class PizzalistComponent implements OnInit {

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private cart: CartService,
    private message: MessageService
  ) { }

  lightboxVisible: boolean = false;
  lightboxImage: string = '';

  pizzas: Pizza[] = [];
  filteredPizzas: Pizza[] = [];
  
  currency = 'Ft';
  serverUrl = environment.serverUrl;
  isLoggedIn: boolean = false;
  searchTerm: string = '';


  ngOnInit(): void {
    this.isLoggedIn = this.auth.isLoggedUser();
    this.getPizzas();
  }


  getPizzas() {
    this.api.selectAll('pizzas').then(res => {
      if (res.status == 200) {
        this.pizzas = res.data;
        this.pizzas.forEach(pizza => {
          pizza.amount = 0;
        });
        this.filteredPizzas = this.pizzas;
      }
    });
  }


  openLightbox(image: string) {
    this.lightboxImage = this.serverUrl + '/uploads/' + image;
    this.lightboxVisible = true;
  }

  addToCart(pizzaId: number) {
    const pizza = this.pizzas.find(p => p.id == pizzaId);
    const amount = pizza!.amount;

    if (amount == 0) {
      this.message.show('danger', 'Hiba!', 'Kérem, adjon meg egy mennyiséget!');
      return;
    }

    let data = {
      userId: this.auth.loggedUser()[0].id,
      pizzaId: pizzaId,
      amount: amount
    }
    pizza!.amount = 0;

    this.api.selectWhere('carts', 'userId', 'eq', data.userId).then(res => {
      let idx = -1;

      if (res.data.length > 0) {
       idx = res.data.findIndex((item: { pizzaId: number; }) => item.pizzaId == data.pizzaId);
      }

      if (idx > -1) {
        data.amount = res.data[idx].amount + amount;
        this.api.update('carts', res.data[idx].id, data).then(res => {
          this.message.show('success', 'Siker', 'A tétel sikeresen módosítva!');
        });
      }
      else {
        this.api.insert('carts', data).then(res => {
          this.message.show('success', 'Siker', 'A tétel sikeresen hozzáadva a kosárhoz!');
          this.cart.refreshCartCount();
        });
      }
    });
  }

  filterPizzas() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredPizzas = this.pizzas.filter(p => 
      p.name.toLowerCase().includes(term) || 
       p.description?.toLowerCase().includes(term)
    );
  }
}
