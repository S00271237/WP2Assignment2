import { AbstractControl, ValidationErrors } from '@angular/forms';

// Turns a Date into the "YYYY-MM-DDTHH:mm" format a datetime-local input needs
export function toLocalInput(date: Date): string {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16); // ai helped here
}

// checks the end time is after the start time
export function endAfterStart(group: AbstractControl): ValidationErrors | null {
  const start = group.get('startTime')?.value;
  const end = group.get('endTime')?.value;
  if (!start || !end) return null;
  return new Date(end) > new Date(start) ? null : { endBeforeStart: true };
}

export const WATER_BODIES = ['Lake', 'River', 'Sea'];