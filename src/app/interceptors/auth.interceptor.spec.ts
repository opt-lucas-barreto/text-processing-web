import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { runInInjectionContext } from '@angular/core';
import { of } from 'rxjs';

import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('AuthInterceptor', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let injector: TestBed;
  let mockHandler: jasmine.SpyObj<HttpHandler>;

  const mockRequest = new HttpRequest('GET', '/api/test');

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    mockHandler = jasmine.createSpyObj('HttpHandler', ['handle']);
    mockHandler.handle.and.returnValue(of({} as HttpEvent<any>));
    
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
    
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    injector = TestBed;
  });

  it('deve ser definido', () => {
    expect(AuthInterceptor).toBeDefined();
  });

  it('deve adicionar header de autorização quando token existe', () => {
    const token = 'mock-jwt-token';
    authService.getToken.and.returnValue(token);
    
    runInInjectionContext(injector, () => {
      AuthInterceptor(mockRequest, mockHandler.handle);
    });
    
    expect(mockHandler.handle).toHaveBeenCalled();
    const modifiedRequest = mockHandler.handle.calls.mostRecent().args[0];
    expect(modifiedRequest.headers.get('Authorization')).toBe(`Bearer ${token}`);
  });

  it('deve não adicionar header de autorização quando token não existe', () => {
    authService.getToken.and.returnValue(null);
    
    runInInjectionContext(injector, () => {
      AuthInterceptor(mockRequest, mockHandler.handle);
    });
    
    expect(mockHandler.handle).toHaveBeenCalled();
    const modifiedRequest = mockHandler.handle.calls.mostRecent().args[0];
    expect(modifiedRequest.headers.get('Authorization')).toBeNull();
  });

  it('deve manter headers existentes', () => {
    const token = 'mock-jwt-token';
    authService.getToken.and.returnValue(token);
    
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const requestWithHeaders = new HttpRequest('POST', '/api/test', null, { headers });
    
    runInInjectionContext(injector, () => {
      AuthInterceptor(requestWithHeaders, mockHandler.handle);
    });
    
    expect(mockHandler.handle).toHaveBeenCalled();
    const modifiedRequest = mockHandler.handle.calls.mostRecent().args[0];
    expect(modifiedRequest.headers.get('Content-Type')).toBe('application/json');
    expect(modifiedRequest.headers.get('Authorization')).toBe(`Bearer ${token}`);
  });

  it('deve criar nova instância de HttpHeaders quando necessário', () => {
    const token = 'mock-jwt-token';
    authService.getToken.and.returnValue(token);
    
    runInInjectionContext(injector, () => {
      AuthInterceptor(mockRequest, mockHandler.handle);
    });
    
    expect(mockHandler.handle).toHaveBeenCalled();
    const modifiedRequest = mockHandler.handle.calls.mostRecent().args[0];
    expect(modifiedRequest.headers).toBeInstanceOf(HttpHeaders);
  });

  it('deve chamar getToken do AuthService', () => {
    authService.getToken.and.returnValue('mock-token');
    
    runInInjectionContext(injector, () => {
      AuthInterceptor(mockRequest, mockHandler.handle);
    });
    
    expect(authService.getToken).toHaveBeenCalled();
  });

  it('deve passar request modificado para o handler', () => {
    const token = 'mock-jwt-token';
    authService.getToken.and.returnValue(token);
    
    runInInjectionContext(injector, () => {
      AuthInterceptor(mockRequest, mockHandler.handle);
    });
    
    expect(mockHandler.handle).toHaveBeenCalledTimes(1);
    const modifiedRequest = mockHandler.handle.calls.mostRecent().args[0];
    expect(modifiedRequest.url).toBe(mockRequest.url);
    expect(modifiedRequest.method).toBe(mockRequest.method);
  });
});
