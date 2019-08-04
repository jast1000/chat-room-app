import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ChatRoomsService } from '../services/chat-rooms.service';
import { Observable, Subscription } from 'rxjs';
import { ChatService } from '../services/chat.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss']
})
export class ChatPage implements OnInit {

  @ViewChild('chat', { static: true, read: IonContent }) 
  private chat: IonContent;

  private chatRoomId: number;
  private chatSubscription: Subscription;

  user: any;
  chatRoom: any = {};
  messages: any[] = [];
  messagesO: Observable<any>;
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private authSrv: AuthenticationService,
    private chatRoomSrv: ChatRoomsService,
    private chatSrv: ChatService
  ) { 
    this.chatRoomId = +this.route.snapshot.paramMap.get('id');
    this.user = this.authSrv.getCurrentUser();
  }

  async ngOnInit() {
    this.chatRoom = await this.chatRoomSrv.getChatRoom(this.chatRoomId);
    this.messagesO = this.chatSrv.getMessages(this.chatRoomId);
    this.chatSubscription = this.messagesO.subscribe(() => {
      setTimeout(() => this.chat.scrollToBottom(0), 100);
    });
  }

  ionViewWillLeave() {
    this.chatSubscription.unsubscribe();
  }

  sendMessage() {
    const newMessage = { 
      userId: this.user.id, 
      username: this.user.username, 
      text: this.message, 
      created: new Date().toISOString() 
    };
    this.chatSrv.sendMessage(this.chatRoomId, newMessage);
    this.message = '';
  }

}
