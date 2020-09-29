import { Challenge } from './Challenge';
import { ChallengeState } from './ChallengeState';

export class CurrentChallenge {
    Challenge?: Challenge;
    State?: ChallengeState;
    TimeLeft?: string;
}