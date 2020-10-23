import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Api } from 'src/app/api';
import { Challenge } from 'src/app/models/Challenges/Challenge';
import { UserStateService } from '../Users/user-state.service';

@Injectable({
  providedIn: 'root'
})
export class ChallengesService {
  constructor(private http: HttpClient, private usersState: UserStateService) { }

  public getChallengeList(): Promise<Array<Challenge>> {
    return this.http.get<Array<Challenge>>(Api.getChallengesList(), this.usersState.authOptions).toPromise();
  }
  
  public getChallenge(id: string): Promise<Challenge> {
    return this.http.get<Challenge>(Api.getChallenge(id), this.usersState.authOptions)
      .pipe(map(C => {
        if (C.toStart) {
          let currentDate = new Date();
          const sign = C.toStart[0] === '-' ? -1 : 1;

          let date = C.toStart.split('.');
          date.pop();

          if (date[0][0] === '-') {
            date[0] = date[0].slice(1);
          }

          let time = date.pop().split(':');

          if (date.length) {
            currentDate = new Date(currentDate.getTime() + 1000*(60*60*24*parseInt(date.pop())));
          }
          
          currentDate = new Date(currentDate.getTime() + 1000 * sign * (60*60*parseInt(time[0]) + 60*parseInt(time[1]) + parseInt(time[0])));

          C.startTime = currentDate.toISOString();
        }
        if (C.toEnd) {
          let currentDate = new Date();
          const sign = C.toEnd[0] === '-' ? -1 : 1;

          let date = C.toEnd.split('.');
          date.pop();

          if (date[0][0] === '-') {
            date[0] = date[0].slice(1);
          }

          let time = date.pop().split(':');

          if (date.length) {
            currentDate = new Date(currentDate.getTime() + 1000*(60*60*24*parseInt(date.pop())));
          }
          
          currentDate = new Date(currentDate.getTime() + 1000 * sign * (60*60*parseInt(time[0]) + 60*parseInt(time[1]) + parseInt(time[0])));

          C.endTime = currentDate.toISOString();
        }
        return C;
      })).toPromise();
  }

  getDump(id: string): Promise<object> {
    return this.http.get<object>(Api.getDump(id), this.usersState.authOptions).toPromise();
  }
}
