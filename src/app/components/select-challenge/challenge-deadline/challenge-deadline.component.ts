import { Component, OnChanges, AfterViewInit, SimpleChanges, Input, ChangeDetectorRef } from '@angular/core';
import { Challenge } from 'src/app/models/Challenges/Challenge';
import { ChallengeUtils } from 'src/app/services/Challenges/ChallengeUtils';

@Component({
  selector: 'app-challenge-deadline',
  templateUrl: './challenge-deadline.component.html',
  styleUrls: ['./challenge-deadline.component.scss']
})
export class ChallengeDeadlineComponent implements AfterViewInit, OnChanges {
  @Input() challenge: Challenge;
  constructor(
    private cdr: ChangeDetectorRef,
    ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.challenge = changes['challenge'].currentValue;
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  public challengeTime(): string {
    return ChallengeUtils.ChallengeTime(this.challenge);
  }

  get challengeTimeComplex(): string {
    const challengeTime = ChallengeUtils.ChallengeTime(this.challenge);

    const complexTime = challengeTime.split(':').map((item) => parseInt(item, 10));
    complexTime.shift();
    if (!complexTime.length) {
      return challengeTime;
    }

    const labels = ['Дней', 'Часов', 'Минут', 'Секунд'];

    const result: string[] = [];
    while (complexTime.length) {
      const value = complexTime.pop();
      if (value) {
        result.unshift(labels.pop() + ': ' + value);
      } else {
        labels.pop();
      }
    }

    return result.join(', ');
  }
}
