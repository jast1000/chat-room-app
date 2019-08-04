import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, timer } from 'rxjs';
import { map, switchMap  } from 'rxjs/operators';

import { AsyncValidatorFn, AbstractControl } from '@angular/forms';

import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UsernameValidator {

  private baseUrl = `${ environment.chatRoomsAPI }/validators`;

  constructor(
    private http: HttpClient
  ) { }

  private isValidUsername(username: string) {
    return timer(500).pipe(
      switchMap(() => {
        const url = `${ this.baseUrl }/username?value=${ username }`;
        return this.http.get<any>(url);
      })
    );
  }

  usernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this.isValidUsername(control.value)
        .pipe(
          map(res => {
            if(res.type === 'ok') {
              return null
            } 
            return { isValidUsername: false };
          })
        );
    };
  }
  
}
