import { Component, Input, OnInit } from '@angular/core';
import { SolutionStatus } from 'src/app/models/Solutions/SolutionStatus';
import { SolutionStatusConverter } from 'src/app/services/SolutionStatusConverter';

@Component({
  selector: 'app-solution-result-table-content',
  templateUrl: './solution-result-table-content.component.html',
  styleUrls: ['./solution-result-table-content.component.scss']
})
export class SolutionResultTableContentComponent implements OnInit {

  @Input() solutionStatus: SolutionStatus;
  @Input() solutionId: string;

  constructor() { }

  ngOnInit(): void {
  }

  fontStyle(status: SolutionStatus): any {
    if (status < SolutionStatus.InQueue) {
      return ["fontStyleRed"];
    }
    if (status < SolutionStatus.Sucessful || status === SolutionStatus.Accepted) {
      return ["fontStyleBlue"];
    }
    return ["fontStyleGreen"];
  }

  solutionStatusPresent(status: SolutionStatus): string {
    return SolutionStatusConverter.convertToPretty(status);
  }
  solutionStatusTooltip(status: SolutionStatus): string {
    return SolutionStatusConverter.getTooltip(status);
  }
  solutionStatusIcon(status: SolutionStatus): string {
    return SolutionStatusConverter.getIcon(status);
  }
}
