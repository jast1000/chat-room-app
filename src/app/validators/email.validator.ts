import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, timer } from 'rxjs';
import { map, switchMap  } from 'rxjs/operators';

import { AsyncValidatorFn, AbstractControl } from '@angular/forms';

import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EmailValidator {

  private baseUrl = `${ environment.chatRoomsAPI }/validators`;

  constructor(
    private http: HttpClient
  ) { }

  private isValidEmail(email: string) {
    return timer(500).pipe(
      switchMap(() => {
        const url = `${ this.baseUrl }/email?value=${ email }`;
        return this.http.get<any>(url);
      })
    );
  }

  emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this.isValidEmail(control.value)
        .pipe(
          map(res => {
            if(res.type === 'ok') {
              return null
            } 
            return { isValidEmail: false };
          })
        );
    };
  }

}
