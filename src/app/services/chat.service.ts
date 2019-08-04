import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private afDatabase: AngularFireDatabase
  ) { }

  getMessages(chatRoomId: number): Observable<any> {
    const key = `chatroom-${ chatRoomId }`;
    return this.afDatabase.list(key).valueChanges();
  }

  sendMessage(chatRoomId: number, message: any): void {
    const key = `chatroom-${ chatRoomId }`;
    const ref = this.afDatabase.list(key);
    ref.push(message);
  }

}
