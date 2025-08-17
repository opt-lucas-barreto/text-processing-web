import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnagramRequest, AnagramResponse } from '../models/anagram.model';

@Injectable({
  providedIn: 'root'
})
export class AnagramService {
  private readonly API_URL = 'http://localhost:8080/api/anagrams';

  constructor(private http: HttpClient) { }

  generateAnagrams(request: AnagramRequest): Observable<AnagramResponse> {
    return this.http.post<AnagramResponse>(
      `${this.API_URL}/generate`,
      request
    );
  }

  generateAnagramsWithoutCache(request: AnagramRequest): Observable<AnagramResponse> {
    return this.http.post<AnagramResponse>(
      `${this.API_URL}/generate-no-cache`,
      request
    );
  }

  getCacheStatus(): Observable<any> {
    return this.http.get(`${this.API_URL}/cache/status`);
  }

  calculateTotalAnagrams(letters: string): Observable<any> {
    return this.http.get(`${this.API_URL}/calculate-total/${letters}`);
  }
}
