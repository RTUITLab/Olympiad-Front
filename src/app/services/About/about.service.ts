import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from 'src/app/api';
import { BuildInfo } from 'src/app/models/About/BuildInfo';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  constructor(private http: HttpClient) { }

  public getBuildInfo(): Promise<BuildInfo> {
    return this.http.get<BuildInfo>(Api.getAbout()).toPromise();
  }
}
