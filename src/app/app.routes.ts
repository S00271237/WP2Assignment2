import { Routes } from '@angular/router';
import { LoginForm } from './login-form/login-form';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login page by default
    { path: 'login', component: LoginForm }
];
