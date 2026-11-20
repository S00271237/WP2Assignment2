import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Angler } from '../models/angler';
import { AnglerService } from '../Service/angler';
import { UserService } from '../Service/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home-page',
  imports: [DatePipe, ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit {
  private formbuilder = inject(FormBuilder);
  private anglerService = inject(AnglerService);
  private userService = inject(UserService);

  angler = signal<Angler | null>(null);
  loading = signal(true);
  showCreateForm = signal(false);
  creating = signal(false);
  error = signal<string | null>(null);

  anglerForm = this.formbuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
  });

  ngOnInit() {
    this.anglerService.getMyAngler().subscribe({
      next: (profile) => {
        this.angler.set(profile);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        if (err.status !== 404) {
          this.error.set('Could not load your profile, please try again');
        }
        // 404 just means no profile yet, so the "Create profile" card shows
      },
    });
  }

  onCreate() {
    if (this.anglerForm.invalid) {
      this.anglerForm.markAllAsTouched();
      return;
    }

    this.creating.set(true);
    this.error.set(null);

    const name = this.anglerForm.getRawValue().name;
    const userId = this.userService.getUserId();

    this.anglerService.createAngler({ user: userId, name }).subscribe({
      next: (profile) => {
        this.angler.set(profile);
        this.creating.set(false);
      },
      error: () => {
        this.creating.set(false);
        this.error.set('Could not create your profile, please try again');
      },
    });

    
  }


  // all catch stats
private allCatches = computed(() =>
  this.angler()?.sessions.flatMap((s) => s.catches) ?? []
);

totalFish = computed(() =>
  this.allCatches().reduce((total, c) => total + (c.quantity ?? 1), 0)
);

largestCatch = computed(() => {
  const measured = this.allCatches().filter((c) => c.sizeCm !== undefined);
  if (measured.length === 0) return null;
  return measured.reduce((biggest, c) => (c.sizeCm! > biggest.sizeCm! ? c : biggest));
});

lastOuting = computed(() => {
  const sessions = this.angler()?.sessions ?? [];
  if (sessions.length === 0) return null;
  return sessions.reduce((latest, s) =>
    new Date(s.startTime) > new Date(latest.startTime) ? s : latest
  );
});

totalSessions = computed(() => this.angler()?.sessions.length ?? 0);
}