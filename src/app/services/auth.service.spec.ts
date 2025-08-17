import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { AuthService } from './auth.service';
import { AuthRequest, AuthResponse } from '../models/auth.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockAuthRequest: AuthRequest = {
    username: 'testuser',
    password: 'testpass'
  };

  const mockAuthResponse: AuthResponse = {
    token: 'mock-jwt-token',
    type: 'Bearer',
    username: 'testuser',
    role: 'USER',
    message: 'Login realizado com sucesso'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withFetch()),
        AuthService
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve fazer login com sucesso', () => {
    service.login(mockAuthRequest).subscribe(response => {
      expect(response).toEqual(mockAuthResponse);
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockAuthRequest);
    req.flush(mockAuthResponse);
  });

  it('deve registrar usuário com sucesso', () => {
    service.register(mockAuthRequest).subscribe(response => {
      expect(response).toEqual(mockAuthResponse);
    });

    const req = httpMock.expectOne('/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockAuthRequest);
    req.flush(mockAuthResponse);
  });

  it('deve tratar erro de login', () => {
    const errorMessage = 'Credenciais inválidas';
    service.login(mockAuthRequest).subscribe({
      next: () => fail('deveria ter falhado'),
      error: (error) => {
        expect(error.error.message).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne('/api/auth/login');
    req.flush({ message: errorMessage }, { status: 401, statusText: 'Unauthorized' });
  });

  it('deve tratar erro de registro', () => {
    const errorMessage = 'Nome de usuário já existe';
    service.register(mockAuthRequest).subscribe({
      next: () => fail('deveria ter falhado'),
      error: (error) => {
        expect(error.error.message).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne('/api/auth/register');
    req.flush({ message: errorMessage }, { status: 400, statusText: 'Bad Request' });
  });

  it('deve emitir usuário atual ao fazer login', () => {
    service.login(mockAuthRequest).subscribe();
    
    const req = httpMock.expectOne('/api/auth/login');
    req.flush(mockAuthResponse);

    service.currentUser$.subscribe(user => {
      expect(user).toEqual({
        username: mockAuthResponse.username,
        role: mockAuthResponse.role,
        token: mockAuthResponse.token
      });
    });
  });

  it('deve limpar usuário ao fazer logout', () => {
    // Primeiro faz login
    service.login(mockAuthRequest).subscribe();
    const req = httpMock.expectOne('/api/auth/login');
    req.flush(mockAuthResponse);

    // Depois faz logout
    service.logout();

    service.currentUser$.subscribe(user => {
      expect(user).toBeNull();
    });
  });

  it('deve retornar token armazenado', () => {
    // Simula token armazenado
    spyOn(localStorage, 'getItem').and.returnValue('mock-token');
    
    const token = service.getToken();
    expect(token).toBe('mock-token');
  });

  it('deve retornar null quando não há token', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    
    const token = service.getToken();
    expect(token).toBeNull();
  });

  it('deve verificar se usuário está logado', () => {
    // Simula token armazenado
    spyOn(localStorage, 'getItem').and.returnValue('mock-token');
    
    const token = service.getToken();
    expect(token).toBeTruthy();
  });

  it('deve verificar se usuário não está logado', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    
    const token = service.getToken();
    expect(token).toBeNull();
  });
});
