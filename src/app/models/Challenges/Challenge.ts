import { ChallengeAccessType } from './CallengeAccessType';

export class Challenge {
  public Id: string;
  public Name: string;
  public Description?: string;
  public CreationTime: string;
  public StartTime?: string;
  public EndTime?: string;
  public ChallengeAccessType: ChallengeAccessType;
}