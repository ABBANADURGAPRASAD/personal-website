import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Achievement } from '../models/home.models';

const API_BASE = 'http://localhost:8080/api/achievements';

@Injectable({ providedIn: 'root' })
export class AchievementService {
  private http = inject(HttpClient);

  getAll(): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(API_BASE).pipe(
      catchError((err) => {
        console.error('AchievementService.getAll failed', err);
        return of([]);
      })
    );
  }

  create(achievement: Partial<Achievement>): Observable<Achievement | null> {
    return this.http.post<Achievement>(API_BASE, achievement).pipe(
      catchError((err) => {
        console.error('AchievementService.create failed', err);
        return of(null);
      })
    );
  }

  update(id: string, achievement: Partial<Achievement>): Observable<Achievement | null> {
    const numId = Number(id);
    if (Number.isNaN(numId)) return of(null);
    return this.http.put<Achievement>(`${API_BASE}/${numId}`, achievement).pipe(
      catchError((err) => {
        console.error('AchievementService.update failed', err);
        return of(null);
      })
    );
  }

  delete(id: string): Observable<boolean> {
    const numId = Number(id);
    if (Number.isNaN(numId)) return of(false);
    return this.http.delete(`${API_BASE}/${numId}`, { observe: 'response' }).pipe(
      map((res) => res.status === 204 || res.status === 200),
      catchError((err) => {
        console.error('AchievementService.delete failed', err);
        return of(false);
      })
    );
  }
}
