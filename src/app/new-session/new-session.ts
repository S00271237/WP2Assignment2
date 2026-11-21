import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AnglerService } from '../Service/angler';

// Checks the end time (if given) is after the start time
function endAfterStart(group: AbstractControl): ValidationErrors | null {
  const start = group.get('startTime')?.value;
  const end = group.get('endTime')?.value;
  if (!start || !end) return null;
  return new Date(end) > new Date(start) ? null : { endBeforeStart: true };
}

// Turns a Date into the "YYYY-MM-DDTHH:mm" format a datetime-local input needs
function toLocalInput(date: Date): string {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

@Component({
  selector: 'app-new-session',
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './new-session.html',
  styleUrl: './new-session.scss',
})
export class NewSession implements OnInit {
  private formbuilder = inject(FormBuilder);
  private anglerService = inject(AnglerService);
  private router = inject(Router);

  waterBodies = ['Lake', 'River', 'Canal', 'Reservoir', 'Sea'];

  anglerId = signal<string | null>(null);
  saving = signal(false);
  saveError = signal<string | null>(null);

  sessionForm = this.formbuilder.nonNullable.group(
    {
      area: ['', Validators.required],
      waterBody: ['', Validators.required],
      startTime: [toLocalInput(new Date()), Validators.required],
      endTime: [''],
    },
    { validators: endAfterStart }
  );

  ngOnInit() {
    // We need the angler's id to know where to add the session
    this.anglerService.getMyAngler().subscribe({
      next: (profile) => this.anglerId.set(profile._id),
      error: (err) => this.saveError.set(err.message ?? 'Could not load your profile'),
    });
  }

  onSubmit() {
    const anglerId = this.anglerId();
    if (this.sessionForm.invalid || !anglerId) {
      this.sessionForm.markAllAsTouched();
      return;
    }

    const form = this.sessionForm.getRawValue();

    const session = {
      location: { area: form.area, waterBody: form.waterBody },
      startTime: new Date(form.startTime).toISOString(),
      ...(form.endTime && { endTime: new Date(form.endTime).toISOString() }),
    };

    this.saving.set(true);
    this.saveError.set(null);

    this.anglerService.addSession(anglerId, session).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/sessions']);
      },
      error: (err) => {
        this.saving.set(false);
        this.saveError.set(err.message ?? 'Could not save the session');
      },
    });
  }
}