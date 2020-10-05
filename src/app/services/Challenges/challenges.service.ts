import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Api } from 'src/app/api';
import { Challenge } from 'src/app/models/Challenges/Challenge';
import { UserStateService } from '../Users/user-state.service';

@Injectable({
  providedIn: 'root'
})
export class ChallengesService { // TODO delete get baseUrl everywhere
  constructor(private http: HttpClient, private usersState: UserStateService) { }

  public getChallengeList(): Promise<Array<Challenge>> {
    return this.http.get<Array<Challenge>>(Api.getChallengesList(), this.usersState.authOptions).toPromise();
  }
  
  public getChallenge(id: string): Promise<Challenge> {
    return this.http.get<Challenge>(Api.getChallenge(id), this.usersState.authOptions).toPromise();
  }

  getDump(id: string): Promise<object> {
    return this.http.get<object>(Api.getDump(id), this.usersState.authOptions).toPromise();
  }
}
