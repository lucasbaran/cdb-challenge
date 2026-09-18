import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { ApiError } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body).pipe(
      catchError(this.handleError)
    );
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Erro inesperado. Tente novamente.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro de conexão: ${error.error.message}`;
    } else {
      const apiError = error.error as ApiError;
      if (apiError?.errors) {
        const messages = Object.values(apiError.errors).flat();
        errorMessage = messages.join(', ');
      } else if (apiError?.title) {
        errorMessage = apiError.title;
      } else if (error.status === 0) {
        errorMessage = 'Servidor indisponível. Verifique sua conexão.';
      }
    }

    return throwError(() => new Error(errorMessage));
  };
}