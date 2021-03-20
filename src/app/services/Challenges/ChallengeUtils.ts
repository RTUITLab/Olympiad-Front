import { Challenge } from 'src/app/models/Challenges/Challenge';
import { ChallengeState } from 'src/app/models/Challenges/ChallengeState';
import { DateHelpers } from '../DateHelpers';

export class ChallengeUtils {
  public static ChallengeTime(challenge: Challenge): string {
    const state = ChallengeUtils.CalcChallengeState(challenge);
    switch (state) {
      case ChallengeState.NoLimits:
        return 'Бессрочное соревнование';
      case ChallengeState.Ended:
        return 'Соревнование завершено';
      case ChallengeState.NotStarted:
        return `До начала: ${DateHelpers.difference(challenge.last - challenge.lenght)}`;
      case ChallengeState.InProgress:
        return `Осталось: ${DateHelpers.difference(challenge.last)}`;
      case ChallengeState.IncorrectLimits:
      default:
        return 'Неверные данные о соревновании, обратитесь к администратору';
    }
  }

  public static CalcChallengeState(challenge: Challenge): ChallengeState {
    if (!challenge) {
      return ChallengeState.IncorrectLimits;
    }
    if (!challenge.startTime || !challenge.endTime) {
      return ChallengeState.NoLimits;
    }

    const now = new Date();
    const nowTime = now.getTime();

    const start = new Date(challenge.startTime);
    const startTime = start.getTime();

    const end = new Date(challenge.endTime);
    const endTime = end.getTime();

    if (startTime > nowTime) {
       return ChallengeState.NotStarted;
    }
    if (nowTime > endTime) {
      return ChallengeState.Ended;
    }
    if (startTime <= nowTime && nowTime <= endTime) {
      return ChallengeState.InProgress;
    }
    return ChallengeState.IncorrectLimits;
  }
}