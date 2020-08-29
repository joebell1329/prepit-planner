import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

type Config = {
  auth: {
    client_id: string,
    domain: string
  };
};

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public config$: Observable<Config>;

  constructor(private http: HttpClient) { }

  public loadConfig(): Observable<Config> {
    if (!this.config$) {
      this.config$ = this.http.get<Config>('/assets/config.json').pipe(shareReplay(1));
    }

    return this.config$;
  }
}
