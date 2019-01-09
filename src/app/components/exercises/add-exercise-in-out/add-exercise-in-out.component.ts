import { Component, OnInit, Input } from '@angular/core';
import { ExerciseService } from '../../../services/exercise.service';
import { ExerciseNewCondition } from '../../../models/ExerciseNewCondition';
@Component({
  selector: 'app-add-exercise-in-out',
  templateUrl: './add-exercise-in-out.component.html',
  styleUrls: ['./add-exercise-in-out.component.scss']
})
export class AddExerciseInOutComponent implements OnInit {
  @Input() exercise_text_edit: boolean;
  constructor(
    private exerciseService: ExerciseService
  ) { }
  public NewCondition: ExerciseNewCondition[];
  ngOnInit() {
    console.log('AddInOut' + this.exercise_text_edit);
    this.NewCondition = [];
    if (this.exercise_text_edit) {
      console.log(this.NewCondition);
    }
  }


}
