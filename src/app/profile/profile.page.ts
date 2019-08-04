import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: any;

  constructor(
    private menuController: MenuController,
    private authSrv: AuthenticationService
  ) { 
    this.user = authSrv.getCurrentUser();
  }

  ngOnInit() { }

}