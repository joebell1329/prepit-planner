import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { API_BASE_URI } from '../api/api.model';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  private attachToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.startsWith(API_BASE_URI)) {
      return this.auth.userProfile$
        .pipe(
          take(1),
          map(profile => profile['https://www.prepit-planner.com/idp_token']),
          switchMap(token => next.handle(this.attachToken(request, token)))
        );
    }
    return next.handle(request);
  }
}
