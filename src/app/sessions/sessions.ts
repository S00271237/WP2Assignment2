import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Angler, Session } from '../models/angler';
import { AnglerService } from '../Service/angler';

@Component({
  selector: 'app-sessions',
  imports: [DatePipe, RouterLink, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './sessions.html',
  styleUrl: './sessions.scss',
})
export class Sessions {
  private anglerService = inject(AnglerService);

  angler = signal<Angler | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  // sort session fron newest first
  sessions = computed(() =>
    [...(this.angler()?.sessions ?? [])].sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    )
  );

  ngOnInit() {
    this.anglerService.getMyAngler().subscribe({
      next: (profile) => {
        this.angler.set(profile);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message ?? 'Could not load your sessions');
      },
    });
  }

fishCount(session: Session): number {
  let total = 0;
  for (const c of session.catches) {
    total += c.quantity ?? 1;
  }
  return total;
}
}