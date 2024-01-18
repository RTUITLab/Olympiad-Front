import { ChallengeAccessType } from './CallengeAccessType';

export class Challenge {
  // поля из API
  /** Уникальный идентификатор соревнования */
  public id: string;
  /** Название соревнования */
  public name: string;
  /** Описание соревнования в формате Markdown */
  public description?: string;
  /** Время начала соревнования как ISO строка */
  public startTime?: string;
  /** Время окончания соревнования как ISO строка */
  public endTime?: string;
  /** Время до окончания соревнования как TimeStamp из .NET */
  public toEnd?: string;
  /** Время до старта соревнования как TimeStamp из .NET */
  public toStart?: string;
  /** Тип доступа к соревнованию */
  public challengeAccessType: ChallengeAccessType;

  // поля, выставляемые на стороне фронта
  /** Время начала соревнования как Date */
  public startTimeDate?: Date;
  /** Время окончания соревнования как Date */
  public endTimeDate?: Date;
}