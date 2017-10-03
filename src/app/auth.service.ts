import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';

import 'rxjs/add/operator/toPromise';

import { UtilService } from './util.service';
import { ApiResponse } from './api-response';
import { User } from './user';

@Injectable()
export class AuthService {
  private apiBaseUrl = `${environment.apiBaseUrl}/auth`;

  constructor(
    private localStorage: LocalStorageService,
    private http: HttpClient,
    private router: Router,
    private utilService: UtilService,
  ) { }

  login(username: string, password: string): Promise<any> {
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}/login`,{username:username, password:password})
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                this.localStorage.set('token', response.data);
              })
              .catch(this.utilService.handleApiError);
  }

  me(): Promise<User> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/me`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                this.localStorage.set('currentUser', response.data);
                return response.data as User
              })
              .catch(response =>{
                this.logout();
                return this.utilService.handleApiError(response);
              });
  }

  refresh(): Promise<any> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/refresh`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                this.localStorage.set('token', response.data);
                if(!this.getCurrentUser()) return this.me();
              })
              .catch(response =>{
                this.logout();
                return this.utilService.handleApiError(response);
              });
  }

  getToken(): string{
    return this.localStorage.get<string>('token');
  }

  getCurrentUser(): User{
    return this.localStorage.get<User>('currentUser');
  }

  isLoggedIn(): boolean {
    var token = this.localStorage.get<string>('token');
    if(token) return true;
    else return false;
  }

  logout(): void {
    this.localStorage.remove('token');
    this.localStorage.remove('currentUser');
    this.router.navigate(['/']);
  }
}
