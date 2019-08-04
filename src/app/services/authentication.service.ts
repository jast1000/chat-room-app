import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient
  ) { }

  async login(credential: any) {
    const url = `${environment.chatRoomsAPI}/login`;
    const user = await this.http.post(url, credential).toPromise();
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  logout() {
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

}
