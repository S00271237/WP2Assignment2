import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Angler } from '../models/angler';

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
}