import { LanguageConverter } from '../models/Language/LanguageConverter';
import { Solution } from '../models/Solutions/Solution';

export class SolutionUtils {
  public static downloadSolution(solution: Solution, program: string): void {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(program));
    element.setAttribute('download', LanguageConverter.fileName(solution.language));
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
