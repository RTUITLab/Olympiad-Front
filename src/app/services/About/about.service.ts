import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from 'src/app/api';
import { BuildInfo, SupportedRuntimesResponse } from 'src/app/models/About/BuildInfo';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  constructor(private http: HttpClient) { }

  public getBuildInfo(): Promise<BuildInfo> {
    return this.http.get<BuildInfo>(Api.getAbout()).toPromise();
  }
  public getSupportedRuntimes(): Promise<SupportedRuntimesResponse> {
    return this.http.get<SupportedRuntimesResponse>(Api.getSupportedRuntimes()).toPromise();
  }
}
