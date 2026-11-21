import { Component } from '@angular/core';
import { UserService } from '../Service/user.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { signal } from '@angular/core';
import { Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-register-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export class RegisterForm {
  private formbuilder = inject(FormBuilder);
  private router = inject(Router);
  private userService = inject(UserService);

  hidePassword = signal(true);
  registering = signal(false);
  registerError = signal<string | null>(null);

registerForm = this.formbuilder.nonNullable.group({

    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(64)]],
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const registerData = this.registerForm.getRawValue();

    this.registering.set(true);
    this.registerError.set(null);

    console.log(registerData);

    this.userService.register(registerData).subscribe({
      next: () => {
        this.registering.set(false);
        this.router.navigate(['/login']); // Navigate to the login page after successful registration
      },
      error: (error) => {
        this.registering.set(false);
        this.registerError.set(error.error.message || 'Registration failed. Please try again.');
      },
    });
}}
