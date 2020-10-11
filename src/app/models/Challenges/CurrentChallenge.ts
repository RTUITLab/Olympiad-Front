import { Challenge } from './Challenge';
import { ChallengeState } from './ChallengeState';

export class CurrentChallenge {
    challenge?: Challenge;
    state?: ChallengeState;
    timeLeft?: string;
}