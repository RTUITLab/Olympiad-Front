import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Exercise } from 'src/app/models/Exercise';

import { ActivatedRoute } from '@angular/router';
import { ParamMap } from '@angular/router/src/shared';
import { ExerciseEditService } from 'src/app/services/exercise-edit.service';
import { UserStateService } from 'src/app/services/user-state.service';
import { LoadingComponent } from 'src/app/components/helpers/loading-component';
import { SolutionViewModel } from 'src/app/models/ViewModels/SolutionViewModel';
import { ExerciseInfo } from 'src/app/models/Responses/ExerciseInfo';
import { ExerciseNewCondition } from 'src/app/models/ExerciseNewCondition';
import { ExerciseService } from 'src/app/services/exercise.service';







@Component({
  selector: 'app-exercise-edit',
  templateUrl: './exercise-edit.component.html',
  styleUrls: ['./exercise-edit.component.scss']
})
export class ExerciseEditComponent extends LoadingComponent  implements OnInit {


  model: SolutionViewModel = new SolutionViewModel();

  //  variable for sending data to the server
  EditedExercise?: ExerciseInfo;
public EditedCondition?: ExerciseNewCondition[];
  constructor(
    private exerciseEditServise: ExerciseEditService,
    private usersService: UserStateService,
    private exercisesService: ExerciseService,
    private router: Router,
    private route: ActivatedRoute,
    ) {
      super();
    }

  ngOnInit() {
         this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.model.ExerciseId = params.get('ExerciseID');
        //  console.log(this.model.ExerciseId);
        this.startLoading();
        this.exercisesService.getExercise(this.model.ExerciseId)
          .subscribe(
          exInfo => {
            this.EditedExercise = exInfo;
            console.log(this.EditedExercise);
            this.stopLoading();
          },
          fail => {
            console.log(fail);
          }
          );
      });
  }
  isAdmin(): boolean {
    return this.usersService.IsAdmin();
  }
  turnOnEditing() {
    console.log('turnOnEditing()');
  }
  turnOffEditing() {
    console.log('turnOffEditing()');
  }
  sendEditedExercise() {
    console.log('sendEditedExercise()');
    console.log(this.EditedExercise);
    console.log(this.EditedCondition);
    // send EditedExercise to the server
   this.exerciseEditServise.SendEditedExercise(this.EditedExercise).subscribe(
     _ => {
       this.sendEditedCondition(this.EditedExercise.Id);
       console.log(`sendEditedExercise_complete`);
     },
     error => console.log(error),
   );
  }
  sendEditedCondition(EditedExerciseId: string) {
    console.log('sendEditedCondition()');
    console.log(this.EditedCondition);
    this.exerciseEditServise.SendEditedCondition(this.EditedCondition, EditedExerciseId).subscribe(
      _ => {
        console.log(`sendEditedCondition_complete`);
        this.router.navigate(['exercises/', this.model.ExerciseId]);
      },
      error => console.log(error),
    );

  }
}