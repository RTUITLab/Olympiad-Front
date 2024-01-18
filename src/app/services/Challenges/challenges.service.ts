import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { last, map } from 'rxjs/operators';
import { Api } from 'src/app/api';
import { Challenge } from 'src/app/models/Challenges/Challenge';
import { UserStateService } from '../Users/user-state.service';
import { DateHelpers } from '../DateHelpers';
import { ChallengeUtils } from './ChallengeUtils';
import { ChallengeState } from 'src/app/models/Challenges/ChallengeState';

@Injectable({
  providedIn: 'root',
})
export class ChallengesService {
  constructor(private http: HttpClient, private usersState: UserStateService) {}

  public getChallengeList(): Promise<Array<Challenge>> {
    return this.http
      .get<Array<Challenge>>(
        Api.getChallengesList(),
        this.usersState.authOptions
      )
      .pipe(
        map((CA) => {
          for (let i = 0; i < CA.length; i++) {
            if (CA[i].toStart) {
              const secondsToStart = DateHelpers.convertLastToTime(
                CA[i].toStart
              );
              CA[i].startTimeDate = new Date(
                new Date().getTime() + secondsToStart * 1000
              );
            }
            if (CA[i].toEnd) {
              const secondsToEnd = DateHelpers.convertLastToTime(CA[i].toEnd);
              const endTimeMilliseconds =
                new Date().getTime() + secondsToEnd * 1000;
              CA[i].endTimeDate = new Date(endTimeMilliseconds);
              if (
                ChallengeUtils.CalcChallengeState(CA[i]) ===
                ChallengeState.InProgress
              ) {
                setInterval(() => {
                  if (new Date().getTime() > endTimeMilliseconds) {
                    location.assign('challenges/' + CA[i].id);
                  }
                }, 1000);
              }
            }
          }
          return CA;
        })
      )
      .toPromise();
  }

  public getChallenge(id: string): Promise<Challenge> {
    return this.http
      .get<Challenge>(Api.getChallenge(id), this.usersState.authOptions)
      .pipe(
        map((C) => {
          if (C.toStart) {
            const secondsToStart = DateHelpers.convertLastToTime(C.toStart);
            C.startTimeDate = new Date(
              new Date().getTime() + secondsToStart * 1000
            );
          }
          if (C.toEnd) {
            const secondsToEnd = DateHelpers.convertLastToTime(C.toEnd);
            C.endTimeDate = new Date(
              new Date().getTime() + secondsToEnd * 1000
            );
          }
          return C;
        })
      )
      .toPromise();
  }

  getDump(id: string): Promise<object> {
    return this.http
      .get<object>(Api.getDump(id), this.usersState.authOptions)
      .toPromise();
  }
}
