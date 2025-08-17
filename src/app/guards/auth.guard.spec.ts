import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('deve ser criado', () => {
    expect(guard).toBeTruthy();
  });

  it('deve permitir acesso quando usuário está autenticado', () => {
    authService.getToken.and.returnValue('mock-token');
    
    const result = guard.canActivate();
    
    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('deve negar acesso e redirecionar quando usuário não está autenticado', () => {
    authService.getToken.and.returnValue(null);
    
    const result = guard.canActivate();
    
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('deve verificar token através do AuthService', () => {
    authService.getToken.and.returnValue('mock-token');
    
    guard.canActivate();
    
    expect(authService.getToken).toHaveBeenCalled();
  });
});
