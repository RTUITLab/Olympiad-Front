import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from 'src/app/api';
import { BuildInfo, SupportedRuntime, SupportedRuntimesResponse } from 'src/app/models/About/BuildInfo';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  constructor(private http: HttpClient) { }

  /** supported runtimes can be cached for one frontend session */
  private _supportedRuntimesResponseCache: SupportedRuntimesResponse | null = null;

  public getBuildInfo(): Promise<BuildInfo> {
    return this.http.get<BuildInfo>(Api.getAbout()).toPromise();
  }
  public async getSupportedRuntimes(): Promise<SupportedRuntimesResponse> {
    if (!this._supportedRuntimesResponseCache) {
      this._supportedRuntimesResponseCache = await this.http.get<SupportedRuntimesResponse>(Api.getSupportedRuntimes()).toPromise(); 
    }
    return this._supportedRuntimesResponseCache;
  }
}
