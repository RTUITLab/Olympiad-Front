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

    if (challenge.toStart && challenge.toStart[0] !== '-') {
       return ChallengeState.NotStarted;
    }
    if (challenge.toEnd && challenge.toEnd[0] === '-') {
      return ChallengeState.Ended;
    }
    if (challenge.toStart && challenge.toStart[0] === '-' && challenge.toEnd && challenge.toEnd[0] !== '-') {
      return ChallengeState.InProgress;
    }
    return ChallengeState.IncorrectLimits;
  }
}
