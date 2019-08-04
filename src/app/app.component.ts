import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  menu: any[] = [
    { text: 'Mi perfil', icon: 'person', action: () => this.openPage('profile') },
    { text: 'Salas', icon: 'chatboxes', action: () => this.openPage('room') },
    { text: 'Salir', icon: 'exit', action: () => this.logout() }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private menuCtrl: MenuController,
    private authSrv: AuthenticationService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async logout() {
    this.authSrv.logout();
    this.menuCtrl.close();
    this.router.navigate(['home']);
  }

  openPage(page: string) {
    this.router.navigate([page]);
    this.menuCtrl.close();
  }

}
