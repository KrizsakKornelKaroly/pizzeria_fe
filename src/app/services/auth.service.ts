import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenName = environment.tokenName;

  private isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedIn.asObservable();

  constructor() { }

  hasToken(): boolean {
    return !!sessionStorage.getItem(this.tokenName);
  }

  login(token: string) {
    sessionStorage.setItem(this.tokenName, token);
    this.isLoggedIn.next(true);
  }
  logout() {
    sessionStorage.removeItem(this.tokenName);
    this.isLoggedIn.next(false);
  }

  loggedUser(){
    const token = sessionStorage.getItem(this.tokenName);
    if (token){
      return JSON.parse(token);
    }
    return null;
  }

  isAdmin() : boolean {
    const user = this.loggedUser();
    return user.role === 'admin';
  }

  isLoggedUser() : boolean {
    return this.isLoggedIn.value;
  }
}
