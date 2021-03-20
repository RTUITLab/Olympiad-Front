import { ChallengeAccessType } from './CallengeAccessType';

export class Challenge {
  public id: string;
  public name: string;
  public description?: string;
  public creationTime: string;
  public startTime?: string;
  public endTime?: string;
  public toEnd?: string;
  public toStart?: string;
  public last?: number;
  public lenght?: number;
  public challengeAccessType: ChallengeAccessType;
}