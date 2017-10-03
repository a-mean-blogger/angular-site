import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(
    private localStorage: LocalStorageService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var token = this.localStorage.get<string>('token');
    var newHeader: HttpHeaders = req.headers;
    newHeader = newHeader.set('Content-Type', 'application/json');
    if(token) newHeader = newHeader.set('x-access-token', token);
    const newReq = req.clone({headers: newHeader});
    return next.handle(newReq);
  }
}
