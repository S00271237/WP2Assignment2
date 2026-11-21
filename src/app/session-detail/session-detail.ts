import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Angler, CatchInput, SessionInput } from '../models/angler';
import { AnglerService } from '../Service/angler';
import { WATER_BODIES, endAfterStart, toLocalInput } from '../utils/session-form';

@Component({
  selector: 'app-session-detail',
  imports: [DatePipe, ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './session-detail.html',
  styleUrl: './session-detail.scss',
})
export class SessionDetail implements OnInit {
  private formbuilder = inject(FormBuilder);
  private anglerService = inject(AnglerService);
  private router = inject(Router);
  private sessionId = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';

  waterBodies = WATER_BODIES;

  angler = signal<Angler | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  savingDetails = signal(false);
  detailsError = signal<string | null>(null);

  addingCatch = signal(false);
  catchError = signal<string | null>(null);
  deletingCatchId = signal<string | null>(null);

  confirmDelete = signal(false);
  deleting = signal(false);

  // The session this page is showing, picked out of the angler's sessions
  session = computed(() => this.angler()?.sessions.find((s) => s._id === this.sessionId) ?? null);

  fishCount = computed(() => {
    let total = 0;
    for (const c of this.session()?.catches ?? []) {
      total += c.quantity ?? 1;
    }
    return total;
  });

  detailsForm = this.formbuilder.nonNullable.group(
    {
      area: ['', Validators.required],
      waterBody: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: [''],
    },
    { validators: endAfterStart }
  );

  catchForm = this.formbuilder.group({
    species: ['', Validators.required],
    quantity: [1 as number | null, [Validators.required, Validators.min(1)]],
    sizeCm: [null as number | null, Validators.min(0)],
    bait: [''],
  });

  ngOnInit() {
    this.anglerService.getMyAngler().subscribe({
      next: (profile) => {
        this.angler.set(profile);
        this.loading.set(false);
        this.fillDetailsForm();
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message ?? 'Could not load this session');
      },
    });
  }

  // Copies the session's current values into the details form
  private fillDetailsForm() {
    const s = this.session();
    if (!s) return;
    this.detailsForm.reset({
      area: s.location.area,
      waterBody: s.location.waterBody,
      startTime: toLocalInput(new Date(s.startTime)),
      endTime: s.endTime ? toLocalInput(new Date(s.endTime)) : '',
    });
  }

  saveDetails() {
    const anglerId = this.angler()?._id;
    if (this.detailsForm.invalid || !anglerId) {
      this.detailsForm.markAllAsTouched();
      return;
    }

    const form = this.detailsForm.getRawValue();
    const changes: Partial<SessionInput> = {
      location: { area: form.area, waterBody: form.waterBody },
      startTime: new Date(form.startTime).toISOString(),
    };
    if (form.endTime) {
      changes.endTime = new Date(form.endTime).toISOString();
    }

    this.savingDetails.set(true);
    this.detailsError.set(null);

    this.anglerService.updateSession(anglerId, this.sessionId, changes).subscribe({
      next: (profile) => {
        this.angler.set(profile);
        this.savingDetails.set(false);
        this.fillDetailsForm();
      },
      error: (err) => {
        this.savingDetails.set(false);
        this.detailsError.set(err.message ?? 'Could not save the changes');
      },
    });
  }

  endNow() {
    this.detailsForm.controls.endTime.setValue(toLocalInput(new Date()));
    this.saveDetails();
  }

  addCatch() {
    const anglerId = this.angler()?._id;
    if (this.catchForm.invalid || !anglerId) {
      this.catchForm.markAllAsTouched();
      return;
    }

    const form = this.catchForm.getRawValue();
    const newCatch: CatchInput = {
      species: form.species!.trim(),
      quantity: form.quantity ?? 1,
    };
    if (form.sizeCm !== null) newCatch.sizeCm = form.sizeCm;
    if (form.bait?.trim()) newCatch.bait = form.bait.trim();

    this.addingCatch.set(true);
    this.catchError.set(null);

    this.anglerService.addCatch(anglerId, this.sessionId, newCatch).subscribe({
      next: (profile) => {
        this.angler.set(profile);
        this.addingCatch.set(false);
        this.catchForm.reset({ species: '', quantity: 1, sizeCm: null, bait: '' });
      },
      error: (err) => {
        this.addingCatch.set(false);
        this.catchError.set(err.message ?? 'Could not add the catch');
      },
    });
  }

  deleteCatch(catchId: string) {
    const anglerId = this.angler()?._id;
    if (!anglerId) return;

    this.deletingCatchId.set(catchId);
    this.anglerService.deleteCatch(anglerId, this.sessionId, catchId).subscribe({
      next: (profile) => {
        this.angler.set(profile);
        this.deletingCatchId.set(null);
      },
      error: (err) => {
        this.deletingCatchId.set(null);
        this.catchError.set(err.message ?? 'Could not delete the catch');
      },
    });
  }

  deleteSession() {
    const anglerId = this.angler()?._id;
    if (!anglerId) return;

    this.deleting.set(true);
    this.anglerService.deleteSession(anglerId, this.sessionId).subscribe({
      next: () => this.router.navigate(['/sessions']),
      error: (err) => {
        this.deleting.set(false);
        this.confirmDelete.set(false);
        this.detailsError.set(err.message ?? 'Could not delete the session');
      },
    });
  }
}