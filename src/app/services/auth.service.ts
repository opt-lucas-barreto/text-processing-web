import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthRequest, AuthResponse, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          this.currentUserSubject.next(JSON.parse(savedUser));
        }
      }
    } catch (error) {
      console.warn('Could not load user from localStorage:', error);
    }
  }

  private saveUserToStorage(user: User | null): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
          localStorage.removeItem('currentUser');
        }
      }
    } catch (error) {
      console.warn('Could not save user to localStorage:', error);
    }
  }

  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          const user: User = {
            username: response.username,
            role: response.role,
            token: response.token
          };
          this.currentUserSubject.next(user);
          this.saveUserToStorage(user);
        })
      );
  }

  register(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, credentials)
      .pipe(
        tap(response => {
          const user: User = {
            username: response.username,
            role: response.role,
            token: response.token
          };
          this.currentUserSubject.next(user);
          this.saveUserToStorage(user);
        })
      );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.saveUserToStorage(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  getToken(): string | null {
    const user = this.getCurrentUser();
    return user ? user.token : null;
  }
}
