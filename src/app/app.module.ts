import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppComponent } from './components/app.component';
import { HeaderComponent } from './components/header/header.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { SelectChallengeComponent } from './components/select-challenge/select-challenge.component';
import { LoginComponent } from './components/login/login.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ChallengeInfoComponent } from './components/challenge-info/challenge-info.component';
import { ExerciseInfoComponent } from './components/exercise-info/exercise-info.component';
import { TaskComponent } from './components/exercise-info/task/task.component';
import { ChallengeDeadlineComponent } from './components/select-challenge/challenge-deadline/challenge-deadline.component';
import { AboutComponent } from './components/about/about.component';
import { MeComponent } from './components/me/me.component';

import { UserStateService } from './services/Users/user-state.service';
import { ToastrModule } from 'ngx-toastr';
import { MarkdownModule } from 'ngx-markdown';
import { FormValidateService } from './services/Forms/form-validate.service';
import { CommonModule } from '@angular/common';
import { AuthGuardService } from './services/AuthGuard/auth-guard.service';
import { ChallengesService } from './services/Challenges/challenges.service';
import { ExerciseService } from './services/Exercises/exercise.service';
import { CurrentChallenge } from './models/Challenges/CurrentChallenge';
import { UpdateService } from './services/Updates/update.service';
import { SolutionService } from './services/Solutions/solution.service';
import { LangInfoComponent } from './components/overview/lang-info/lang-info.component';
import { ExersizeInfoLogComponent } from './exersize-info-log/exersize-info-log.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UserInfoComponent,
    SelectChallengeComponent,
    LoginComponent,
    OverviewComponent,
    ChallengeInfoComponent,
    ExerciseInfoComponent,
    TaskComponent,
    ChallengeDeadlineComponent,
    AboutComponent,
    MeComponent,
    LangInfoComponent,
    ExersizeInfoLogComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatMenuModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    MarkdownModule.forRoot({ loader: HttpClient }),
    MatSidenavModule,
    MatTooltipModule
  ],
  providers: [
    UserStateService,
    ChallengesService,
    ExerciseService,
    AuthGuardService,
    FormValidateService,
    Title,
    CurrentChallenge,
    UpdateService,
    SolutionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
