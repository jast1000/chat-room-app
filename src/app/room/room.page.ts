import { Component, OnInit } from '@angular/core';

import { ChatRoomsService } from '../services/chat-rooms.service';

import { AlertController, LoadingController, ToastController } from '@ionic/angular';

import { Router } from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {

  chatRooms: any;

  constructor(
    private chatRoomSrv: ChatRoomsService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.getChatRooms();
  }

  async refresh(event) {
    try {
      this.chatRooms = await this.chatRoomSrv.getChatRooms();
    } catch (ex) {
      const toast = await this.toastCtrl.create({ message: "Ocurrio un error", duration: 4000});
      await toast.present();
    }
    
    event.target.complete();
  }

  private async getChatRooms() {
    const loading = await this.loadingCtrl.create();
    loading.present();
    try {
      this.chatRooms = await this.chatRoomSrv.getChatRooms();
      await loading.dismiss();
    } catch (ex) {
      const toast = await this.toastCtrl.create({ message: "Ocurrio un error", duration: 4000});
      await loading.dismiss();
      await toast.present();
    }
  }

  async createChatRoom() {
    const alert =  await this.alertCtrl.create({
      header: "Creación de sala",
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre'
        },
        {
          name: 'description',
          type: 'text',
          placeholder: 'Descripción'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Guardar',
          handler: (data) => this.saveChatRoom(data)
        }
      ]
    });

    await alert.present();
  }

  private async saveChatRoom(data: any) {
    if(!data.name || !data.description) {
      return;
    }
    const loading = await this.loadingCtrl.create();
    loading.present();
    try {
      const toast = await this.toastCtrl.create({ message: "Sala creada con éxito", duration: 4000});
      await this.chatRoomSrv.saveChatRoom(data);
      await loading.dismiss();
      await this.getChatRooms();
      await toast.present();
    } catch (ex) {  
      const toast = await this.toastCtrl.create({ message: "Ocurrio un error", duration: 4000});
      await loading.dismiss();
      await toast.present();
    }
  }

  async deleteChatRoom(id: number) {
    const loading = await this.loadingCtrl.create();
    loading.present();
    try {
      const toast = await this.toastCtrl.create({ message: "Sala eliminada con éxito", duration: 4000});
      await this.chatRoomSrv.deleteChatRoom(id);
      await loading.dismiss();
      await this.getChatRooms();
      await toast.present();
    } catch (ex) {
      const toast = await this.toastCtrl.create({ message: "Ocurrio un error", duration: 4000});
      await loading.dismiss();
      await toast.present();
    }
  }

  openChatRoom(id: number) {
    this.router.navigate(['chat', id]);
  }

}
