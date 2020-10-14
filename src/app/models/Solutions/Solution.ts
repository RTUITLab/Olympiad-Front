import { SolutionStatus } from './SolutionStatus';

export class Solution {
  language: string;
  id: string;
  raw: string;
  exerciseId: string;
  status: SolutionStatus;
  hiddenStatus?: any;
  sendingTime?: string;
  startCheckingTime: string;
  checkedTime: string;
}
