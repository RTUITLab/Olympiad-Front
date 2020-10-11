import { SolutionStatus } from './SolutionStatus';

export class Solution {
  language: string;
  id: string;
  raw: string;
  exerciseId: string;
  status: SolutionStatus;
  sendingTime: string;
  startCheckingTime: string;
  checkedTime: string;
}
