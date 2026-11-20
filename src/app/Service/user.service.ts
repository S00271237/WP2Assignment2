import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { computed } from '@angular/core';
import { LoginRequest } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  
  private apiUrl = 'http://localhost:3010/api/v1/auth'; 

  private tokenKey = 'token';

  token = signal<string | null>(localStorage.getItem(this.tokenKey)); // Initialize the token signal with the value from localStorage
  isLoggedIn = computed(() => !!this.token()); // Computed signal to determine if the user is logged in based on the token

  login(credentials: LoginRequest) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials)
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.token.set(token); // Update the token signal with the new value
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.token.set(null); // Clear the token signal
  }

  register(registerData: { name: string; email: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, registerData);
  }

  getUserId(): string {
  const token = this.token();
  if (!token) return '';
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.sub; // use the same field name you found in TokenPayload
}
}
