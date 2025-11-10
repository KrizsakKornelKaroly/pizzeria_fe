import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Pizza } from '../../../interfaces/pizza';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../services/message.service';
import { NumberFormatPipe } from "../../../pipes/number-format.pipe";

declare var bootstrap: any;

@Component({
  selector: 'app-pizzas',
  standalone: true,
  imports: [CommonModule, FormsModule, NumberFormatPipe],
  templateUrl: './pizzas.component.html',
  styleUrl: './pizzas.component.scss'
})
export class PizzasComponent implements OnInit {
  currency = environment.currency;
  pizzas: Pizza[] = [];
  editMode = false;

  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  pagedPizzas: Pizza[] = [];


  formModal: any;
  confirmModal: any;

  pizza: Pizza = {
    id: 0,
    name: '',
    image: '',
    description: '',
    calories: 0,
    price: 0
  }

  constructor(
    private api: ApiService,
    private message: MessageService
  ) { }

  ngOnInit(): void {
    this.getPizzas();
    this.formModal = new bootstrap.Modal('#formModal');
    this.confirmModal = new bootstrap.Modal('#confirmModal');
  }

  getPizzas() {
    this.api.selectAll('pizzas').then(res => {
      this.pizzas = res.data;
      this.totalPages = Math.ceil(this.pizzas.length / this.pageSize);
      this.setPage(1);
    });
  }

  setPage(page: number) {

    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedPizzas = this.pizzas.slice(startIndex, endIndex);


  }

  getPizza(id: number) {
    this.api.select('pizzas', id).then(res => {
      this.pizza = res.data[0];
      this.editMode = true;
      this.formModal.show();
    });
  }

  save() {

    if (!this.pizza.name || this.pizza.price == 0 || this.pizza.calories == 0) {
      this.message.show('danger', 'Hiba', 'Kérlek töltsd ki a kötelező mezőket!');
      return;
    }

    if (this.editMode) {
      this.api.selectAll('pizzas/name/eq/' + this.pizza.name).then(res => {
        if (res.data.length != 0 && res.data[0].id != this.pizza.id) {
          this.message.show('danger', 'Hiba', 'Ilyen nevű pizza már létezik!');
          return;
        }
        this.pizza.image = '';
        this.api.update('pizzas', this.pizza.id, this.pizza).then(res => {
          this.message.show('success', 'Siker', 'Pizza módosítva!');
          this.formModal.hide();
          this.editMode = false;
          this.pizza = {
            id: 0,
            name: '',
            description: '',
            image: '',
            calories: 0,
            price: 0
          }
          this.getPizzas();
        });

      });
    }
    else {
      this.api.selectAll('pizzas/name/eq/' + this.pizza.name).then(res => {
        if (res.data.length != 0) {
          this.message.show('danger', 'Hiba', 'Ilyen nevű pizza már létezik!');
          return;
        }

        this.api.insert('pizzas', this.pizza).then(res => {
          this.message.show('success', 'Siker', 'Pizza hozzáadva!');
          this.formModal.hide();
          this.pizza = {
            id: 0,
            name: '',
            description: '',
            image: '',
            calories: 0,
            price: 0
          }
          this.getPizzas();
          return;
        });
      });
    }
  }

  confirmDelete(id: number) {
    this.pizza.id = id;
    this.confirmModal.show();
  }

  delete(id: number) {
    this.api.delete('pizzas', id).then(res => {
      this.message.show('success', 'Siker', 'Pizza törölve!');
      this.confirmModal.hide();
      this.pizza = {
        id: 0,
        name: '',
        description: '',
        image: '',
        calories: 0,
        price: 0
      };
      this.getPizzas();
    });
  }

}
