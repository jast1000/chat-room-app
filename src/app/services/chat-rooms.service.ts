import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomsService {

  private baseUrl = `${ environment.chatRoomsAPI }/chat-rooms`;

  constructor(
    private http: HttpClient
  ) { }

  getChatRooms() {
    return this.http.get(this.baseUrl).toPromise();
  }

  saveChatRoom(chatRoom: any) {
    return this.http.post(this.baseUrl, chatRoom).toPromise();
  }

  deleteChatRoom(id: number) {
    const url = `${ this.baseUrl }/${ id }`;
    return this.http.delete(url).toPromise();
  }

  getChatRoom(id: number) {
    const url = `${ this.baseUrl }/${ id }`;
    return this.http.get(url).toPromise();
  }

}
