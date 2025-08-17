import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  isRegisterMode = false;
  showPassword = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Se já estiver autenticado, redireciona para home
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.router.navigate(['/home']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials = this.loginForm.value;
      const authObservable = this.isRegisterMode 
        ? this.authService.register(credentials)
        : this.authService.login(credentials);

      authObservable.subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.isLoading = false;
          
          // Tratar diferentes tipos de erro
          if (error.status === 400) {
            // Erro de validação (Bad Request)
            if (error.error && error.error.message) {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage = this.isRegisterMode 
                ? 'Dados inválidos. Verifique username e senha.'
                : 'Dados inválidos. Verifique username e senha.';
            }
          } else if (error.status === 401) {
            // Credenciais inválidas
            this.errorMessage = 'Credenciais inválidas. Verifique username e senha.';
          } else if (error.status === 409) {
            // Conflito (usuário já existe)
            this.errorMessage = 'Nome de usuário já existe. Escolha outro nome.';
          } else {
            // Erro genérico
            this.errorMessage = this.isRegisterMode 
              ? 'Erro ao registrar usuário. Tente novamente.'
              : 'Erro ao fazer login. Tente novamente.';
          }
          
          console.error('Erro na autenticação:', error);
        }
      });
    }
  }

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
    this.showPassword = false; // Reset password visibility when switching modes
    this.loginForm.reset();
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
}
