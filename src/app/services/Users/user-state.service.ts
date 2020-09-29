import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { User } from '../../models/Users/User';
import { LoginViewModel } from '../../models/Login/LoginViewModel';
import { LoginResponse } from '../../models/Login/LoginResponce';
import { Api } from '../../api';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private usersBehavior = new BehaviorSubject<User>(undefined);
  public currentUserStream = this.usersBehavior.asObservable();
  public currentUser: User;

  constructor(private http: HttpClient) { }

  private initUser(response: LoginResponse) {
    const user: User = {
      FirstName: response.FirstName,
      StudentID: response.StudentId,
      id: response.Id,
      Token: response.Token,
      Email: response.Email,
      Roles: this.parseJwt(response.Token)
    };
    localStorage.setItem('userToken', response.Token);
    this.usersBehavior.next(user);
    this.currentUser = user;
  }

  public getMe(token: string): Observable<boolean> {
    let observer: Subscriber<boolean>;
    const observable = new Observable<boolean>(obs => {
      observer = obs;
    });
    
    this.http.get<LoginResponse>(Api.getMe(),
      { headers: { 'Authorization': `Bearer ${token}` } })
      .subscribe(
        response => {
          this.initUser(response);
          observer.next(true);
        },
        failure => {
          this.logOut();
          observer.next(false);
        }
      );
    return observable;
  }

  public login(model: LoginViewModel): Observable<LoginResponse> {
    let observer: Subscriber<LoginResponse>;
    const observable = new Observable<LoginResponse>(obs => {
      observer = obs;
    });

    this.http.post<LoginResponse>(Api.login(), model, { responseType: 'json' })
      .subscribe(
        event => {
          this.initUser(event);
          observer.next(event);
        },
        error => observer.error('Неверные email (ID) или пароль')
      );
    return observable;
  }

  public isAdmin(): boolean {
    if (!this.currentUser) {
      return false;
    }
    if (!environment.production) {
      return environment.isAdmin;
    }
    if (!this.currentUser.Roles) {
      return false;
    }
    return this.currentUser.Roles.indexOf('Admin') !== -1;
  }

  public get authOptions(): object {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('userToken')}`
      })
    }
  }

  public get bearer(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('userToken')}`
    })
  }

  public logOut(): void {
    localStorage.removeItem('userToken');
    this.usersBehavior.next(null);
    this.currentUser = null;
  }

  private parseJwt(token: string): string[] {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64))['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  }
}
