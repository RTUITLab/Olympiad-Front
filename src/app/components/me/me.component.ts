import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { LoginViewModel } from 'src/app/models/Login/LoginViewModel';
import { User } from 'src/app/models/Users/User';
import { UserStateService } from 'src/app/services/Users/user-state.service';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {
  user: User;
  public isChangingPassword = false;
  model: LoginViewModel;

  newPassForm = new FormGroup({
    CurrentPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    NewPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });

  constructor(
    private usersState: UserStateService,
    private toastr: ToastrService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.usersState.currentUserStream.subscribe(U => this.user = U);
    this.titleService.setTitle('Моя страница');
  }

  onSubmit(): void {
    if (this.newPassForm.valid) {
      this.model = this.newPassForm.value;
      this.usersState.changePass(this.model)
        .then(() => this.toastr.success('Пароль успешно изменён', 'Успешно'))
        .catch(() => this.toastr.error('Невозможно изменить пароль', `Ошибка`));
    } else {
      this.toastr.error('Введите корректные данные', `Ошибка`);
    }
  }
}
