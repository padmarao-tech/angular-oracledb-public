import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AppRequestInterceptor implements HttpInterceptor {
  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    let authorizationData = localStorage.getItem('authorizationData');

    if (authorizationData)
    {
      authorizationData = 'Bearer ' + JSON.parse(authorizationData);
      authReq = req.clone({
        headers: req.headers.set('Authorization', authorizationData)
      });
    }
    return next.handle(authReq);
  }
}

export const appRequestInterceptorProvider = { 
  provide: HTTP_INTERCEPTORS,
  useClass: AppRequestInterceptor,
  multi: true
};