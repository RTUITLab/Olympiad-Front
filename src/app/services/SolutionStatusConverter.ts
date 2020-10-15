import { SolutionStatus } from '../models/Solutions/SolutionStatus';

export class SolutionStatusConverter {
  private static readonly info: StatusDesc[] = [
    {
      status: -1,
      pretty: 'Нет решений',
      tooltip: '',
      icon: '-1'
    },
    {
      status: SolutionStatus.Accepted,
      pretty: 'Решение принято',
      tooltip: 'Программа принята на проверку, результат будет известен после окончания соревнования',
      icon: '6'
    },
    {
      status: SolutionStatus.InQueue,
      pretty: 'В очереди на проверку',
      tooltip: 'Программа находится в очереди на проверку',
      icon: '3'
    },
    {
      status: SolutionStatus.InProcessing,
      pretty: 'Проверяется',
      tooltip: 'Программа проверяется',
      icon: '4'
    },
    {
      status: SolutionStatus.ErrorWhileCompile,
      pretty: 'Внутренняя ошибка системы',
      tooltip: 'Внутренняя ошибка системы',
      icon: '0'
    },
    {
      status: SolutionStatus.CompileError,
      pretty: 'Ошибка компиляции',
      tooltip: 'Программа не компилируется',
      icon: '0'
    },
    {
      status: SolutionStatus.TooLongWork,
      pretty: 'Программа работает слишком долго',
      tooltip: 'Программа выполнялась слишком долго',
      icon: '2'
    },
    {
      status: SolutionStatus.RunTimeError,
      pretty: 'Ошибка во время исполнения',
      tooltip: 'Есть данные в потоке ошибок',
      icon: '1'
    },
    {
      status: SolutionStatus.Sucessful,
      pretty: 'Решение проверено',
      tooltip: 'Программа успешно прошла все испытания',
      icon: '5'
    },
    {
      status: SolutionStatus.WrongAnswer,
      pretty: 'Программа выдает неверный ответ',
      tooltip: 'Программа печатает неверный результат',
      icon: '1'
    }
  ];

  static convertToPretty(status: SolutionStatus): string {
    return SolutionStatusConverter.info.find(D => D.status === status).pretty;
  }

  static getIcon(status: SolutionStatus): string {
    return SolutionStatusConverter.info.find(D => D.status === status).icon;
  }

  static getTooltip(status: SolutionStatus): string {
    return SolutionStatusConverter.info.find(D => D.status === status).tooltip;
  }
}

class StatusDesc {
  status: SolutionStatus;
  pretty: string;
  tooltip: string;
  icon?: string
}
