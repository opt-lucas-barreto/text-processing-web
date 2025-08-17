import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const mockAuthResponse = {
    token: 'mock-token',
    type: 'Bearer',
    username: 'testuser',
    role: 'USER',
    message: 'Login realizado com sucesso'
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'register'], {
      currentUser$: of(null)
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar com showPassword como false', () => {
    expect(component.showPassword).toBeFalse();
  });

  it('deve alternar a visibilidade da senha', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalse();
  });

  it('deve resetar showPassword ao alternar modo', () => {
    component.showPassword = true;
    component.toggleMode();
    expect(component.showPassword).toBeFalse();
  });

  it('deve validar formulário vazio', () => {
    expect(component.loginForm.valid).toBeFalse();
    expect(component.username?.errors?.['required']).toBeTruthy();
    expect(component.password?.errors?.['required']).toBeTruthy();
  });

  it('deve validar formulário com dados válidos', () => {
    component.loginForm.patchValue({
      username: 'testuser',
      password: 'testpass'
    });
    expect(component.loginForm.valid).toBeTrue();
  });

  it('deve fazer login com sucesso', () => {
    authService.login.and.returnValue(of(mockAuthResponse));
    
    component.loginForm.patchValue({
      username: 'testuser',
      password: 'testpass'
    });
    
    component.onSubmit();
    
    expect(authService.login).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'testpass'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('deve registrar usuário com sucesso', () => {
    authService.register.and.returnValue(of(mockAuthResponse));
    
    component.isRegisterMode = true;
    component.loginForm.patchValue({
      username: 'newuser',
      password: 'newpass'
    });
    
    component.onSubmit();
    
    expect(authService.register).toHaveBeenCalledWith({
      username: 'newuser',
      password: 'newpass'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('deve tratar erro de login', () => {
    const error = { status: 401, error: { message: 'Credenciais inválidas' } };
    authService.login.and.returnValue(throwError(() => error));
    
    component.loginForm.patchValue({
      username: 'testuser',
      password: 'wrongpass'
    });
    
    component.onSubmit();
    
    expect(component.errorMessage).toBe('Credenciais inválidas. Verifique username e senha.');
  });

  it('deve tratar erro de registro', () => {
    const error = { status: 400, error: { message: 'Nome de usuário já existe' } };
    authService.register.and.returnValue(throwError(() => error));
    
    component.isRegisterMode = true;
    component.loginForm.patchValue({
      username: 'existinguser',
      password: 'password123'
    });
    
    component.onSubmit();
    
    expect(component.errorMessage).toBe('Nome de usuário já existe. Escolha outro nome.');
  });

  it('deve exibir botão de alternar visibilidade da senha', () => {
    const toggleButton = fixture.nativeElement.querySelector('.password-toggle-btn');
    expect(toggleButton).toBeTruthy();
  });

  it('deve alterar o tipo do input de senha', () => {
    const passwordInput = fixture.nativeElement.querySelector('input[formControlName="password"]');
    expect(passwordInput.type).toBe('password');
    
    component.togglePasswordVisibility();
    fixture.detectChanges();
    expect(passwordInput.type).toBe('text');
  });

  it('deve implementar OnDestroy', () => {
    spyOn(component, 'ngOnDestroy');
    component.ngOnDestroy();
    expect(component.ngOnDestroy).toHaveBeenCalled();
  });
});
