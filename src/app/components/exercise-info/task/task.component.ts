import { Component, Input, OnInit } from '@angular/core';
import { ExerciseInfo } from 'src/app/models/Exercises/ExerciseInfo';
import { InOutData } from 'src/app/models/Exercises/InOutData';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  @Input() exerciseInfo: ExerciseInfo;
  @Input() inOutData: InOutData[];

  constructor() { }

  ngOnInit(): void { }

}
