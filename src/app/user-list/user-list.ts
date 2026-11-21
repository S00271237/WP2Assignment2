import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { User } from '../models/user';
import { UserService } from '../Service/user.service';
import { AdminService } from '../Service/admin';

@Component({
  selector: 'app-user-list',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit {
  private adminService = inject(AdminService);
  currentUserId = inject(UserService).getUserId();

  users = signal<User[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  confirmingId = signal<string | null>(null);
  deletingId = signal<string | null>(null);

  ngOnInit() {
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message ?? 'Could not load users');
      },
    });
  }

  deleteUser(id: string) {
    this.deletingId.set(id);
    this.error.set(null);

    this.adminService.deleteUser(id).subscribe({
      next: () => {
        this.users.update((list) => list.filter((u) => u._id !== id));
        this.deletingId.set(null);
        this.confirmingId.set(null);
      },
      error: (err) => {
        this.deletingId.set(null);
        this.error.set(err.message ?? 'Could not delete the user');
      },
    });
  }
}