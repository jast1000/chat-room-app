import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-menu-photo',
  templateUrl: './menu-photo.component.html',
  styleUrls: ['./menu-photo.component.scss'],
})
export class MenuPhotoComponent implements OnInit {

  options: any[] = [
    { id: 1, text: "Subir foto con camara" },
    { id: 2, text: "Subir foto con galería" },
    { id: 3, text: "Eliminar foto" }
  ];

  constructor(
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {}

  async selectOption(option: any) {
    await this.popoverCtrl.dismiss(option);
  }

}
