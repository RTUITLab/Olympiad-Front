import { from } from 'rxjs';
import { ChallengeAccessType } from './CallengeAccessType';
import { ChallengeState} from './ChallengeState';

export class Challenge {
  public Id: string;
  public Name: string;
  public CreationTime: string;
  public StartTime?: string;
  public EndTime?: string;
  public ChallengeAccessType: ChallengeAccessType;
}