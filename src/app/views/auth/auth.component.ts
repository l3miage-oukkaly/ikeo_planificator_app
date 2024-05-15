import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";
import {merge} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatError,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent {
  authService = inject(AuthService)
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]);

  errorEmailMessage = '';
  errorPasswordMessage = '';
  errorFormMessage = signal<string>('');

  hidePassword = true;

  constructor() {
    this.authService.logout()
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailErrorMessage());
    merge(this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updatePasswordErrorMessage());
  }

  submitForm() {
    if (this.email.valid && this.password.valid) {
      this.authService.loginEmail(this.email.value!, this.password.value!, this.errorFormMessage)
    }
  }

  updateEmailErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorEmailMessage = 'Email nécessaire';
    } else if (this.email.hasError('email')) {
      this.errorEmailMessage = 'Format email invalide';
    } else {
      this.errorEmailMessage = '';
    }
  }

  updatePasswordErrorMessage() {
    if (this.password.hasError('required')) {
      this.errorPasswordMessage = 'Mot de passe nécessaire';
    } else if (this.password.hasError('email')) {
      this.errorPasswordMessage = 'Taille comprise entre 8 & 15 caractères';
    } else {
      this.errorPasswordMessage = '';
    }
  }

}
