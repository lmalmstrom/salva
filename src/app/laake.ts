import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../environments/environment';

export interface Laake {
  nimi: string;
  minimimaara: string;
  muoto: string;
  mista: string;
  expMonth: string;
  expYear: string;
  status?: 'default' | 'ok' | 'puute';
}

@Injectable({ providedIn: 'root' })
export class Laakkeet {
  private http = inject(HttpClient);
  private firebaseUrl = environment.firebaseUrl;

  getLaakkeet(location: string) {
    return this.http.get<{ Laakkeet: Laake[] }>(`${this.firebaseUrl}/${location}/laakkeet.json`).pipe(
      map(data => {
        return data.Laakkeet;
      }),
      catchError((err) => {
        return this.getDefault();
      })
    );

  }

  private getDefault() {
    return this.http.get<{ Laakkeet: Laake[] }>('data.json').pipe(
      map(data => {
        return data.Laakkeet;
      })
    );
  }

  saveLaakkeet(location: string, laakkeet: Laake[]) {
    return this.http.put(
      `${this.firebaseUrl}/${location}/laakkeet.json`,
      laakkeet
    );
  }
}
