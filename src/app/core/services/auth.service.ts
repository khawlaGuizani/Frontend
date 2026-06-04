import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRole } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = '/api';
  private readonly tokenKey = 'token';
  private readonly roleKey = 'role';

  constructor(private http: HttpClient) {}

  // 🔐 LOGIN
  login(data: any): Observable<any> {
    return this.http.post(`${this.api}/auth/login`, data);
  }

  // 👤 USERS CRUD
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/utilisateurs`);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.api}/auth/register`, data);
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.api}/utilisateurs/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/utilisateurs/${id}`);
  }

  changePassword(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.api}/utilisateurs/${id}/mot-de-passe`, payload);
  }

  // 🔐 TOKEN MANAGEMENT
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  saveRole(role: UserRole): void {
    localStorage.setItem(this.roleKey, role);
  }

  getRole(): UserRole | null {
    const role = localStorage.getItem(this.roleKey);
    return this.isUserRole(role) ? role : this.getRoleFromToken();
  }

  resolveRoleFromLoginResponse(response: unknown): UserRole | null {
    if (!response || typeof response !== 'object') {
      return null;
    }

    const data = response as Record<string, unknown>;
    const directRole = this.normalizeRole(data['role']);
    if (directRole) {
      return directRole;
    }

    const user = data['user'];
    if (user && typeof user === 'object') {
      const userRole = this.normalizeRole((user as Record<string, unknown>)['role']);
      if (userRole) {
        return userRole;
      }
    }

    const token = data['token'];
    return typeof token === 'string' ? this.getRoleFromToken(token) : null;
  }

  getDashboardRoute(role: UserRole | null = this.getRole()): string {
    if (role === 'ADMIN') {
      return '/admin';
    }

    if (role === 'DEMANDEUR' || role === 'VALIDATEUR') {
      return '/demandes';
    }

    return '/login';
  }

  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  createArticle(data: any) {
  return this.http.post('/api/articles', data);
}

getArticles() {
  return this.http.get<any[]>('/api/articles');
}

  private getRoleFromToken(token = this.getToken()): UserRole | null {
    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as Record<string, unknown>;
      return (
        this.normalizeRole(payload['role']) ||
        this.normalizeRole(payload['authority']) ||
        this.normalizeRole(payload['authorities']) ||
        this.normalizeRole(payload['roles'])
      );
    } catch {
      return null;
    }
  }

  private normalizeRole(value: unknown): UserRole | null {
    if (Array.isArray(value)) {
      for (const item of value) {
        const role = this.normalizeRole(item);
        if (role) {
          return role;
        }
      }
      return null;
    }

    if (value && typeof value === 'object') {
      return this.normalizeRole((value as Record<string, unknown>)['authority']);
    }

    if (typeof value !== 'string') {
      return null;
    }

    const role = value.replace('ROLE_', '').toUpperCase();
    return this.isUserRole(role) ? role : null;
  }

  private isUserRole(role: unknown): role is UserRole {
    return role === 'ADMIN' || role === 'DEMANDEUR' || role === 'VALIDATEUR';
  }
}
