import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoginRequest } from '../models/user';
import { UserService } from '../Service/user.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressBarModule, MatIconModule, MatCardModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  private formbuilder = inject(FormBuilder);
  private router = inject(Router);
  private userService = inject(UserService);
  loggingIn = signal(false);
  loginError = signal<string | null>(null);
  hidePassword = signal(true);

  loginForm = this.formbuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.maxLength(64)]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials: LoginRequest = this.loginForm.getRawValue();

    this.loggingIn.set(true);
    this.loginError.set(null);

    console.log(credentials);

    this.userService.login(credentials).subscribe({
      next: (response) => {
        this.userService.saveToken(response.token);
        this.loggingIn.set(false);
        this.router.navigate(['/home']); // Navigate to the home page after successful login
      },
      error: (err:Error) => {
        this.loggingIn.set(false);
        this.loginError.set(err.message);
      },
    });
  }
}