import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Angler } from '../models/angler';
import { SessionInput } from '../models/angler';
import { CatchInput } from '../models/angler';

@Injectable({ providedIn: 'root' })
export class AnglerService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3010/api/v1/anglers';

  getMyAngler() {
    return this.http.get<Angler>(`${this.apiUrl}/me`);
  }

  createAngler(data: { user: string; name: string }) {
    return this.http.post<Angler>(this.apiUrl, data);
  }

  addSession(anglerId: string, session: { location: { area: string; waterBody: string }; startTime: string; endTime?: string }) {
    return this.http.post<Angler>(`${this.apiUrl}/${anglerId}/sessions`, session);
  }

  updateSession(anglerId: string, sessionId: string, changes: Partial<SessionInput>) {
  return this.http.put<Angler>(`${this.apiUrl}/${anglerId}/sessions/${sessionId}`, changes);
}

  deleteSession(anglerId: string, sessionId: string) {
  return this.http.delete<Angler>(`${this.apiUrl}/${anglerId}/sessions/${sessionId}`);
}

  addCatch(anglerId: string, sessionId: string, newCatch: CatchInput) {
  return this.http.post<Angler>(`${this.apiUrl}/${anglerId}/sessions/${sessionId}/catches`, newCatch);
}

  deleteCatch(anglerId: string, sessionId: string, catchId: string) {
  return this.http.delete<Angler>(`${this.apiUrl}/${anglerId}/sessions/${sessionId}/catches/${catchId}`);
}
}