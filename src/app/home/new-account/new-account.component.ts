import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { EmailValidator } from 'src/app/validators/email.validator';
import { UsernameValidator } from 'src/app/validators/username.validator';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.scss'],
})
export class NewAccountComponent implements OnInit {

  accountForm: FormGroup;

  constructor(
    private accountSrv: AccountService,
    private emailValidator: EmailValidator,
    private usernameValidator: UsernameValidator,
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { 
    this.accountForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')], this.emailValidator.emailValidator()],
      username: ['', Validators.required, this.usernameValidator.usernameValidator()],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {}

  async save() {
    console.log(this.accountForm);
    const loading = await this.loadingCtrl.create();
    await loading.present();

    const user = this.accountForm.value;
    try {
      await this.accountSrv.saveUser(user);
      await loading.dismiss();

      const toast = await this.toastCtrl.create({message: "Cuenta creada con éxito", duration: 4000});
      await toast.present();

      this.modalCtrl.dismiss();
    } catch (ex) {
      await loading.dismiss();

      let message = "Ocurrio un error";
      if(ex.status === 400) {
        message = "El usuario o email no disponibles";
      }
      const toast = await this.toastCtrl.create({message, duration: 4000})
      await toast.present();
    }

  }

  exit() {
    this.modalCtrl.dismiss();
  }

}
