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
      firstName: response.firstName,
      studentID: response.studentId,
      id: response.id,
      token: response.token,
      email: response.email,
      roles: this.parseJwt(response.token)
    };

    if (!sessionStorage.getItem('userToken')) {
      localStorage.setItem('userToken', response.token);
    }

    this.usersBehavior.next(user);
    this.currentUser = user;
  }

  public getMe(token: string): Observable<boolean> {
    let observer: Subscriber<boolean>;
    const observable = new Observable<boolean>(obs => {
      observer = obs;
    });

    this.http.get<LoginResponse>(
      Api.getMe(),
      { headers: { 'Authorization': `Bearer ${token}` } }
    )
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
    // TODO: server can't read client IP (docker swarm ingress)
    // as workaround - client can request ip

    const loginAfterIpHandler = (ipModel: { ip: string }) => {
      this.http.post<LoginResponse>(Api.login(), { ...model, clientIp: ipModel.ip }, { responseType: 'json' })
        .subscribe(
          event => {
            this.initUser(event);
            observer.next(event);
          },
          error => {
            if (error.status === 400) {
              observer.error('Неверные email (ID) или пароль');
            } else {
              observer.error('Сервер недоступен\nПроверьте соединение');
            }
          }
        );
    };
    const ipRequest = fetch("https://api.ipify.org?format=json");
    ipRequest
      .then(r => r.json())
      .then(loginAfterIpHandler);
    ipRequest
      .catch(r => loginAfterIpHandler({ip: JSON.stringify(r).substring(0,50)}));
    return observable;
  }

  public changePass(model: LoginViewModel): Promise<Object> {
    return this.http.post(Api.changePassword(), model, { responseType: 'json', headers: this.bearer }).toPromise();
  }

  public isAdmin(): boolean {
    if (!this.currentUser) {
      return false;
    }
    if (!environment.production) {
      return environment.isAdmin;
    }
    if (!this.currentUser.roles) {
      return false;
    }
    return this.currentUser.roles.indexOf('Admin') !== -1;
  }

  public get authOptions(): object {
    const token = sessionStorage.getItem('userToken') || localStorage.getItem('userToken');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  public get bearer(): HttpHeaders {
    const token = sessionStorage.getItem('userToken') || localStorage.getItem('userToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  public logOut(): void {
    if (sessionStorage.getItem('userToken')) {
      sessionStorage.removeItem('userToken');

      this.getMe(localStorage.getItem('userToken'));
    } else {
      localStorage.removeItem('userToken');

      this.usersBehavior.next(null);
      this.currentUser = null;
    }
  }

  private parseJwt(token: string): string[] {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64))['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  }
}
