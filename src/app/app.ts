import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../app/Service/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('WP2Assignment2');

  userService = inject(UserService)
  private router = inject(Router)

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
