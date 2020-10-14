import { SolutionStatus } from '../models/Solutions/SolutionStatus';

export class SolutionStatusConverter {
  private static readonly info: StatusDesc[] = [
    {
      status: -1,
      pretty: 'Нет решений',
      icon: '-1'
    },
    {
      status: SolutionStatus.Accepted,
      pretty: 'Решение принято',
      icon: '5'
    },
    {
      status: SolutionStatus.InQueue,
      pretty: 'В очереди на проверку',
      icon: '3'
    },
    {
      status: SolutionStatus.InProcessing,
      pretty: 'Проверяется',
      icon: '4'
    },
    {
      status: SolutionStatus.ErrorWhileCompile,
      pretty: 'Ошибка при компиляции на стороне сервера',
      icon: '0'
    },
    {
      status: SolutionStatus.CompileError,
      pretty: 'Ошибка компиляции',
      icon: '0'
    },
    {
      status: SolutionStatus.TooLongWork,
      pretty: 'Программа работает слишком долго',
      icon: '2'
    },
    {
      status: SolutionStatus.RunTimeError,
      pretty: 'Ошибка во время исполнения',
      icon: '1'
    },
    {
      status: SolutionStatus.Sucessful,
      pretty: 'Задание решено верно',
      icon: '5'
    },
    {
      status: SolutionStatus.WrongAnswer,
      pretty: 'Программа выдает неверный ответ',
      icon: '1'
    }
  ];

  static convertToPretty(status: SolutionStatus): string {
    return SolutionStatusConverter.info.find(D => D.status === status).pretty;
  }

  static getIcon(status: SolutionStatus): string {
    return SolutionStatusConverter.info.find(D => D.status === status).icon;
  }
}

class StatusDesc {
  status: SolutionStatus;
  pretty: string;
  icon?: string
}
