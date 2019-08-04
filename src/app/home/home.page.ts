import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../services/authentication.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  loginForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authSrv: AuthenticationService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.loginForm = this.fb.group( {
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    const user = this.authSrv.getCurrentUser();
    if (user) {
      this.router.navigate(['profile']);
    }
  }

  async login() {
    const credential  = this.loginForm.value;
    const loading = await this.loadingCtrl.create();
    
    await loading.present();
    try {
      await this.authSrv.login(credential);
      loading.dismiss();
      this.router.navigate(['profile']);
    } catch (ex) {
      loading.dismiss();

      let message = 'Ocurrió un error'; 
      if( ex.status === 401) {
        message = 'Usuario o contraseña incorrecta';
      }
      const toast = await this.toastCtrl.create({message, duration: 4000})
      await toast.present();
    }
    
    
  }

}
