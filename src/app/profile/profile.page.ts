import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AuthenticationService } from '../services/authentication.service';



import { pipe, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ImagePicker, ImagePickerOptions, OutputType } from '@ionic-native/image-picker/ngx';
import { UtilsService } from '../services/utils.service';
import { CognitiveService } from '../services/cognitive.service';
import { AccountService } from '../services/account.service';
import { PopoverController, LoadingController, ToastController } from '@ionic/angular';
import { MenuPhotoComponent } from './menu-photo/menu-photo.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: any;

  constructor(
    private accountSrv: AccountService,
    private authSrv: AuthenticationService,
    private cognitiveSrv: CognitiveService,
    private utilsSrv: UtilsService,
    private popoverCtrl: PopoverController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private camera: Camera,
    private picker: ImagePicker
  ) { 
    this.loadUser();
  }

  ngOnInit() { }

  private loadUser() {
    this.user = this.authSrv.getCurrentUser();
  }

  async openMenu(event: any) {
    const popover = await this.popoverCtrl.create({
      component: MenuPhotoComponent,
      event: event,
      translucent: true
    });
    await popover.present();
    const result = await popover.onDidDismiss();
    if(result.data) {
      if(result.data.id === 1) {
        await this.openCamera();
      } else if(result.data.id === 2) {
        await this.openGallery();
      } else {
        this.deleteAvatar();
      }
    }
  }

  async openGallery() {
    const options: ImagePickerOptions = {
      maximumImagesCount: 1,
      quality: 20,
      outputType: OutputType.DATA_URL
    };
    try {
      const photos = await this.picker.getPictures(options);
      if (photos && photos.length > 0) {
        await this.tryUploadPhoto(photos[0]);
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  async openCamera() {
    const options: CameraOptions = {
      quality: 20,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    try {
      const photo = await this.camera.getPicture(options);
      await this.tryUploadPhoto(photo);
    } catch (ex) {
      console.error(ex);
    }
  }

  private async tryUploadPhoto(photoBase64: string) {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    try {
      const photoBlob = await this.utilsSrv.base64ToBinary(photoBase64);
      const result: any = await this.cognitiveSrv.analyzeImage(photoBlob);
      console.log(result);

      let validPhoto: boolean = true; 
      if (result.adult.isAdultContent || result.adult.isRacyContent) {
        validPhoto = false;
      } else if(result.brands.length > 0) {
        validPhoto = false;
      } else {
        const celebrities = [];
        result.categories.forEach(category => {
          if (category.detail && category.detail.celebrities) {
            if (category.detail.celebrities.length > 0) {
              celebrities.push(category.detail.celebrities);
            }
          }
        });
        if (celebrities.length > 0) {
          validPhoto = false;
        }
      }

      if (validPhoto) {
        const fileName = `${ new Date().getTime()}.jpeg`;
        const task = this.accountSrv.uploadPhotoToBucket(photoBase64, fileName);
        task.snapshotChanges().pipe(
          finalize(
            async () => {
              await loading.dismiss();
              await this.saveAvatar(fileName);
            }
          )
        ).subscribe();
      } else {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({ message: 'La foto no cumple con el reglamento', duration: 4000});
        await toast.present();
      }
    } catch (ex) {
      console.error(ex);
      await loading.dismiss();
      const toast = await this.toastCtrl.create({ message: 'Ocurrio un error', duration: 4000});
      await toast.present();
    }

  }

  private async saveAvatar(fileName: string) {
    const photoUrl = await this.accountSrv.getUrlImageFromBucket(fileName);
    this.accountSrv.localSaveAvatar(photoUrl);
    const toast = await this.toastCtrl.create({ message: 'Foto actualizada con éxito', duration: 4000});
    await toast.present();
    this.loadUser();
  }

  private async deleteAvatar() {
    this.accountSrv.deleteLocalAvatar();
    const toast = await this.toastCtrl.create({ message: 'Foto actualizada con éxito', duration: 4000});
    await toast.present();
    this.loadUser();
  }

}