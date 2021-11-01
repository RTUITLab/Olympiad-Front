import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { last, map } from 'rxjs/operators';
import { Api } from 'src/app/api';
import { Challenge } from 'src/app/models/Challenges/Challenge';
import { UserStateService } from '../Users/user-state.service';
import {DateHelpers} from "../DateHelpers";

@Injectable({
  providedIn: 'root'
})
export class ChallengesService {
  constructor(private http: HttpClient, private usersState: UserStateService) { }

  public getChallengeList(): Promise<Array<Challenge>> {
    return this.http.get<Array<Challenge>>(Api.getChallengesList(), this.usersState.authOptions)
      .pipe(map(CA => {
        for (let i = 0; i < CA.length; i++) {
          CA[i].last = 0;
          CA[i].lenght = 0;
          if (CA[i].toStart) {
            const secondsToStart = DateHelpers.convertLastToTime(CA[i].toStart);
            CA[i].startTime = (new Date((new Date()).getTime() + secondsToStart * 1000)).toISOString();

            CA[i].lenght -= secondsToStart;
          }
          if (CA[i].toEnd) {
            const secondsToEnd = DateHelpers.convertLastToTime(CA[i].toEnd);
            CA[i].endTime = (new Date((new Date()).getTime() + secondsToEnd * 1000)).toISOString();

            CA[i].last += secondsToEnd;
            CA[i].lenght += secondsToEnd;
            setInterval(() => {
              CA[i].last!--;

              if (CA[i].last === CA[i].lenght || CA[i].last === 0) {
                location.assign('challenges/' + CA[i].id);
              }
            }, 1000);
          }
        }
        return CA;
      })).toPromise();
  }

  public getChallenge(id: string): Promise<Challenge> {
    return this.http.get<Challenge>(Api.getChallenge(id), this.usersState.authOptions)
      .pipe(map(C => {

        C.last = 0;
        C.lenght = 0;
        if (C.toStart) {
          const secondsToStart = DateHelpers.convertLastToTime(C.toStart);
          C.startTime = (new Date((new Date()).getTime() + secondsToStart * 1000)).toISOString();

          C.lenght -= secondsToStart;
        }
        if (C.toEnd) {
          const secondsToEnd = DateHelpers.convertLastToTime(C.toEnd);
          C.endTime = (new Date((new Date()).getTime() + secondsToEnd * 1000)).toISOString();

          C.last += secondsToEnd;
          C.lenght += secondsToEnd;

          setInterval(() => {
            C.last!--;
          }, 1000);
        }
        return C;
      })).toPromise();
  }

  getDump(id: string): Promise<object> {
    return this.http.get<object>(Api.getDump(id), this.usersState.authOptions).toPromise();
  }
}
