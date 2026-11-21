import { Routes } from '@angular/router';
import { LoginForm } from './login-form/login-form';
import { RegisterForm } from './register-form/register-form';
import { HomePage } from './home-page/home-page';
import { Sessions } from './sessions/sessions';
import { NewSession } from './new-session/new-session';
import { SessionDetail } from './session-detail/session-detail';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login page by default
    { path: 'login', component: LoginForm },
    { path: 'register', component: RegisterForm },
    { path: 'home', component: HomePage },
    { path: 'sessions', component: Sessions },
    { path: 'sessions/new', component: NewSession },
    { path: 'sessions/:id', component: SessionDetail },
];
