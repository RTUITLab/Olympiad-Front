import { ChallengeAccessType } from './CallengeAccessType';

export class Challenge {
  public id: string;
  public name: string;
  public description?: string;
  public creationTime: string;
  public startTime?: string;
  public endTime?: string;
  public challengeAccessType: ChallengeAccessType;
}