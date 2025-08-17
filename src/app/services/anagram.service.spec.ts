import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { AnagramService } from './anagram.service';
import { AnagramRequest, AnagramResponse } from '../models/anagram.model';

describe('AnagramService', () => {
  let service: AnagramService;
  let httpMock: HttpTestingController;

  const mockAnagramRequest: AnagramRequest = {
    letters: 'abc'
  };

  const mockAnagramResponse: AnagramResponse = {
    originalLetters: 'abc',
    anagrams: ['abc', 'acb', 'bac', 'bca', 'cab', 'cba'],
    totalAnagrams: 6,
    fromCache: false,
    processingTimeMs: 100
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withFetch()),
        AnagramService
      ]
    });
    service = TestBed.inject(AnagramService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve gerar anagramas com sucesso', () => {
    service.generateAnagrams(mockAnagramRequest).subscribe(response => {
      expect(response).toEqual(mockAnagramResponse);
    });

    const req = httpMock.expectOne('/api/anagrams/generate');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockAnagramRequest);
    req.flush(mockAnagramResponse);
  });

  it('deve tratar erro na geração de anagramas', () => {
    const errorMessage = 'Erro ao gerar anagramas';
    service.generateAnagrams(mockAnagramRequest).subscribe({
      next: () => fail('deveria ter falhado'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.error.message).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne('/api/anagrams/generate');
    req.flush({ message: errorMessage }, { status: 500, statusText: 'Internal Server Error' });
  });

  it('deve fazer requisição para endpoint correto', () => {
    service.generateAnagrams(mockAnagramRequest).subscribe();
    
    const req = httpMock.expectOne('/api/anagrams/generate');
    expect(req.request.url).toBe('/api/anagrams/generate');
    req.flush(mockAnagramResponse);
  });

  it('deve usar método POST', () => {
    service.generateAnagrams(mockAnagramRequest).subscribe();
    
    const req = httpMock.expectOne('/api/anagrams/generate');
    expect(req.request.method).toBe('POST');
    req.flush(mockAnagramResponse);
  });

  it('deve enviar dados corretos no corpo da requisição', () => {
    service.generateAnagrams(mockAnagramRequest).subscribe();
    
    const req = httpMock.expectOne('/api/anagrams/generate');
    expect(req.request.body).toEqual(mockAnagramRequest);
    req.flush(mockAnagramResponse);
  });

  it('deve retornar resposta com estrutura correta', () => {
    service.generateAnagrams(mockAnagramRequest).subscribe(response => {
      expect(response.originalLetters).toBe('abc');
      expect(response.anagrams).toEqual(['abc', 'acb', 'bac', 'bca', 'cab', 'cba']);
      expect(response.totalAnagrams).toBe(6);
      expect(response.fromCache).toBeFalse();
      expect(response.processingTimeMs).toBe(100);
    });

    const req = httpMock.expectOne('/api/anagrams/generate');
    req.flush(mockAnagramResponse);
  });

  it('deve lidar com resposta vazia', () => {
    const emptyResponse: AnagramResponse = {
      originalLetters: '',
      anagrams: [],
      totalAnagrams: 0,
      fromCache: false,
      processingTimeMs: 0
    };

    service.generateAnagrams(mockAnagramRequest).subscribe(response => {
      expect(response.anagrams).toEqual([]);
      expect(response.totalAnagrams).toBe(0);
    });

    const req = httpMock.expectOne('/api/anagrams/generate');
    req.flush(emptyResponse);
  });

  it('deve lidar com diferentes tamanhos de entrada', () => {
    const shortRequest: AnagramRequest = { letters: 'a' };
    const longRequest: AnagramRequest = { letters: 'abcdefghij' };

    service.generateAnagrams(shortRequest).subscribe();
    const req1 = httpMock.expectOne('/api/anagrams/generate');
    req1.flush(mockAnagramResponse);

    service.generateAnagrams(longRequest).subscribe();
    const req2 = httpMock.expectOne('/api/anagrams/generate');
    req2.flush(mockAnagramResponse);
  });
});
