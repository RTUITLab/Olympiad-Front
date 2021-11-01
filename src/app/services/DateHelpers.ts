export class DateHelpers {
  private static readonly oneSecond = 1000;
  private static readonly oneMinute = DateHelpers.oneSecond * 60;
  private static readonly oneHour = DateHelpers.oneMinute * 60;
  private static readonly oneDay = DateHelpers.oneHour * 24;

  public static convertTime(time: string): string {
    const date = new Date(time);
    let result = '';

    result += `${DateHelpers.round(date.getDate())}`;
    result += `.${DateHelpers.round(date.getMonth() + 1)}`;
    result += `.${date.getFullYear()} в ${date.getHours()}`;
    result += `:${DateHelpers.round(date.getMinutes())}`;
    result += `:${DateHelpers.round(date.getSeconds())}`;

    return result;
  }

  public static prettyTime(time: string): string {
    const date = new Date(time);
    let prettyDate = '';
    prettyDate += `${DateHelpers.round(date.getDate())}`;
    prettyDate += `.${DateHelpers.round(date.getMonth() + 1)}`;
    prettyDate += `.${date.getFullYear()} ${date.getHours()}`;
    prettyDate += `:${DateHelpers.round(date.getMinutes())}`;
    prettyDate += `:${DateHelpers.round(date.getSeconds())}`;
    return prettyDate;
  }

  public static difference(difference: number): string {
    difference *= 1000;
    let result = ' ';
    const days = Math.floor((difference / DateHelpers.oneDay));
    if (days > 0) {
      result += `${days}:`;
      difference -= days * DateHelpers.oneDay;
    }

    const hours = Math.floor((difference / DateHelpers.oneHour));
    if (hours > 9) {
      result += `${hours}:`;
    } else {
      result += `0${hours}:`;
    }
    difference -= hours * DateHelpers.oneHour;

    const minutes = Math.floor((difference / DateHelpers.oneMinute));
    if (minutes > 9) {
      result += `${minutes}:`;
    } else {
      result += `0${minutes}:`;
    }
    difference -= minutes * DateHelpers.oneMinute;

    const seconds = Math.floor((difference / DateHelpers.oneSecond));
    if (seconds > 9) {
      result += `${seconds}`;
    } else {
       result += `0${seconds}`;
    }

    if (difference < 0) {
      result += `00:00:00`;
    }
    return result;
  }

  public static convertLastToTime(last: string): number {
    let sign = 1;

    if (last[0] === '-') {
      sign = -1;
      last = last.slice(1);
    }

    let result = 0;

    const splittedLast = last.split('.');
    if (splittedLast.length === 3) {
      result += parseInt(splittedLast.shift(), 10) * this.oneDay;
    }

    const time = splittedLast.shift().split(':');
    result += parseInt(time[0], 10) * this.oneHour + parseInt(time[1], 10) * this.oneMinute + parseInt(time[2], 10) * this.oneSecond;

    return result * sign / 1000;
  }

  private static round(val: number): string {
    if (val < 10) {
      return '0' + val;
    } else {
      return val.toString();
    }
  }
}
