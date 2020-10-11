import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { ChallengeInfoComponent } from './components/challenge-info/challenge-info.component';
import { ExerciseInfoComponent } from './components/exercise-info/exercise-info.component';
import { LoginComponent } from './components/login/login.component';
import { MeComponent } from './components/me/me.component';
import { OverviewComponent } from './components/overview/overview.component';
import { AuthGuardService } from './services/AuthGuard/auth-guard.service';

const routes: Routes = [
  {
    path: 'overview',
    component: OverviewComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'about',
    component: AboutComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'me',
    component: MeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'challenges/:ChallengeId',
    component: ChallengeInfoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'exercises/:ExerciseID',
    component: ExerciseInfoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/overview'
  },
  {
    path: '**',
    redirectTo: '/overview'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
