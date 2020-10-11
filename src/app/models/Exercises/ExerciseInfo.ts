import { Solution } from '../Solutions/Solution';

export class ExerciseInfo {
    id: string;
    challengeId: string;
    name: string;
    score: number;
    exerciseTask: string;
    solutions: Solution[];
}
