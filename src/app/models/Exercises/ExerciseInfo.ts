import { Solution } from '../Solutions/Solution';
import { ExerciseRestrictions } from './ExerciseRestrictions';

export class ExerciseInfo {
    id: string;
    challengeId: string;
    name: string;
    score: number;
    exerciseTask: string;
    solutions?: Solution[];
    showScores?: boolean;
    restrictions: ExerciseRestrictions;
}
