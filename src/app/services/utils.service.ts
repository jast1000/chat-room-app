import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor( ) { }

  base64ToBinary(image: string) {
    const url = `data:image/jpeg;base64,${ image }`;
    return fetch(url).then(res => res.blob());
  }

}
