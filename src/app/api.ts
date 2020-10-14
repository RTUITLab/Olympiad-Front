import { environment } from 'src/environments/environment';
import { LanguageConverter } from './models/Language/LanguageConverter';
import { SolutionViewModel } from './models/Solutions/SolutionViewModel';

export class Api {
  private static baseUrl = environment.baseUrl;

  //  Challenges  //
  /////////////////

  public static getChallengesList(): string {
    return `${this.baseUrl}/api/challenges`;
  }

  public static getChallenge(id: string): string {
    return `${this.baseUrl}/api/challenges/${id}`;
  }

  public static createChallenge(): string {
    return `${this.baseUrl}/api/challenges`;
  }

  public static editChallenge(id: string): string {
    return `${this.baseUrl}/api/challenges/${id}`;
  }

  public static getDump(id: string): string {
    return `${this.baseUrl}/api/dump/${id}`;
  }

  //  Exercises   //
  //////////////////

  public static getExercises(challengeId: string): string {
    return `${this.baseUrl}/api/exercises?challengeId=${challengeId}`;
  }

  public static getExercise(exerciseId: string): string {
    return `${this.baseUrl}/api/exercises/${exerciseId}`;
  }

  public static getExerciseInOutData(exerciseId: string): string {
    return `${this.baseUrl}/api/exerciseData/${exerciseId}`;
  }

  public static getAllExerciseInOutData(exerciseId: string): string {
    return `${this.baseUrl}/api/exerciseData/all/${exerciseId}`;
  }

  public static updateExerciseInOutData(inOutDataId: string): string {
    return `${this.baseUrl}/api/exerciseData/${inOutDataId}`;
  }

  public static addExerciseInOutData(exerciseId: string): string {
    return `${this.baseUrl}/api/exerciseData/${exerciseId}`;
  }

  public static getUserExerciseSolutions(exerciseId: string, userId: string): string {
    return `${this.baseUrl}/api/check/${exerciseId}/${userId}`;
  }

  public static sendSolution(solutionView: SolutionViewModel): string {
    return `${this.baseUrl}/api/check/${LanguageConverter.webName(solutionView.language)}/${solutionView.exerciseId}`;
  }

  public static downloadSolution(solutionId: string): string {
    return `${this.baseUrl}/api/check/download/${solutionId}`;
  }

  public static checkSolutionsLogs(solutionId: string): string {
    return `${this.baseUrl}/api/check/logs/${solutionId}`;
  }

  public static checkSolution(solutionId: string): string {
    return `${this.baseUrl}/api/check/${solutionId}`;
  }

  public static recheckSolutions(exerciseId: string): string {
    return `${this.baseUrl}/api/check/recheck/${exerciseId}`;
  }

  public static recheckSolution(exerciseId: string): string {
    return `${this.baseUrl}/api/check/recheckSolution/${exerciseId}`;
  }

  public static recheckUserSolutions(userId: string): string {
    return `${this.baseUrl}/api/check/recheckUserSolution/${userId}`;
  }

  public static getSignalRHubUrl(): string {
    return `${this.baseUrl}/api/hubs/solutionStatus`;
  }

  public static getSolutionsForExercise(exerciseId: string): string {
    return `${this.baseUrl}/api/check/forExercise?exerciseId=${exerciseId}`;
  }

  //  Auth  //
  ////////////

  public static getMe(): string {
    return `${this.baseUrl}/api/auth/getme`;
  }

  public static login(): string {
    return `${this.baseUrl}/api/auth/login`;
  }

  public static changePassword(): string {
    return `${this.baseUrl}/api/account/changePassword`;
  }
}
