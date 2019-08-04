import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient
  ) { }

  saveUser(user: any) {
    const url = `${ environment.chatRoomsAPI }/users`;
    return this.http.post(url, user).toPromise();
  }
}
