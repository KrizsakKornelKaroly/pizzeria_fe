import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { User } from '../../../interfaces/user';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  constructor(
    private api: ApiService,
    private message: MessageService,
    private router: Router
  ) { }

  acceptTerms: boolean = false;
  newUser: User = {
    name: '',
    email: '',
    password: '',
    confirm: '',
    role: 'user'
  };

  registration() {
    if (!this.acceptTerms) {
      this.message.show('danger', 'Hiba', 'Az ÁSZF elfogadása kötelező!');
      return;
    }

    this.api.registration('users', this.newUser).then(res => {
      if (res.status == 500) {
        this.message.show('danger', 'Hiba', res.message);
        return;
      }
      let data = {
        "template": "registration",
        "to": this.newUser.email,
        "subject": "Sikeres regisztráció",
        "data": {
          "name": this.newUser.name,
          "email": this.newUser.email,
          "password": this.newUser.password,
          "url": "http://localhost:3000/"
        }
      };

      this.api.sendmail(data);

      this.message.show('success', 'Siker', res.message);
      this.router.navigate(['/login']);
    });
  }
}
