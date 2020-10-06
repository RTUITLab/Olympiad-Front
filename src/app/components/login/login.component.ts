import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginViewModel } from 'src/app/models/Login/LoginViewModel';
import { FormValidateService } from 'src/app/services/Forms/form-validate.service';
import { UserStateService } from 'src/app/services/Users/user-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorMessage: string;
  model: LoginViewModel;

  loginForm = new FormGroup({
    Login: new FormControl('', [
      Validators.required
    ]),
    Password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });

  constructor(
    private usersState: UserStateService,
    private router: Router,
    private toastr: ToastrService,
    private titleService: Title,
    private formValid: FormValidateService
  ) { }

  get login() { return this.loginForm.controls['Login']; }
  
  get password() { return this.loginForm.controls['Password']; }

  ngOnInit(): void {
    this.titleService.setTitle('Вход');
    if (localStorage.getItem('userToken')) {
      this.router.navigate(['/overview']);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.model = this.loginForm.value;
      this.usersState.login(this.model).subscribe(
        success => {
          this.router.navigate(['overview']);
        },
        error => {
          this.errorMessage = error;
          this.toastr.error(this.errorMessage, `Ошибка`);
        }
      );
    } else {
      this.formValid.validateAllFormFields(this.loginForm);
    }
  }
}
