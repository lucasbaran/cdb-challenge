import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { CalculateCdbRequest, CalculateCdbResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CdbCalculatorService {
  constructor(private apiService: ApiService) {}

  calculate(request: CalculateCdbRequest): Observable<CalculateCdbResponse> {
    return this.apiService.post<CalculateCdbResponse>('/calculate', request);
  }
}