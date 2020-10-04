import { Solution } from '../Solutions/Solution';

export class ExerciseInfo {
    Id: string;
    ChallengeId: string;
    Name: string;
    Score: number;
    ExerciseTask: string;
    Solutions: Solution[];
}