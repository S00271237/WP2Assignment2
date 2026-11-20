import { Routes } from '@angular/router';
import { LoginForm } from './login-form/login-form';
import { RegisterForm } from './register-form/register-form';
import { HomePage } from './home-page/home-page';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login page by default
    { path: 'login', component: LoginForm },
    { path: 'register', component: RegisterForm },
    { path: 'home', component: HomePage }
];
