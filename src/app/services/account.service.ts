import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient,
    private storage: AngularFireStorage
  ) { }

  saveUser(user: any) {
    const url = `${ environment.chatRoomsAPI }/users`;
    return this.http.post(url, user).toPromise();
  }

  uploadPhotoToBucket(photo: string, fileName: string) {
    const ref = this.storage.ref(fileName);
    const metadata = {
      contentType: 'image/jpeg'
    }
    return ref.putString(photo, 'base64', metadata);
  }

  getUrlImageFromBucket(fileName: string) {
    const ref = this.storage.ref(fileName);
    return ref.getDownloadURL().toPromise();
  }

  localSaveAvatar(imageUrl: string) {
    const user = JSON.parse(localStorage.getItem('user'));
    user.avatar = imageUrl;
    localStorage.setItem('user', JSON.stringify(user));
  }

  deleteLocalAvatar() {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user.avatar) {
      delete user.avatar;
    }
    localStorage.setItem('user', JSON.stringify(user));
  }

}
