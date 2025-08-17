import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const mockUser = {
    username: 'testuser',
    role: 'USER'
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      currentUser$: of(mockUser)
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir nome do projeto', () => {
    const projectName = fixture.nativeElement.querySelector('.project-name');
    expect(projectName.textContent).toContain('Text Processing API');
  });

  it('deve exibir nome do usuário quando logado', () => {
    const username = fixture.nativeElement.querySelector('.username');
    expect(username.textContent).toContain('testuser');
  });

  it('deve exibir botão de logout quando usuário está logado', () => {
    const logoutButton = fixture.nativeElement.querySelector('.logout-btn');
    expect(logoutButton).toBeTruthy();
    expect(logoutButton.textContent).toContain('Sair');
  });

  it('deve chamar logout ao clicar no botão', () => {
    const logoutButton = fixture.nativeElement.querySelector('.logout-btn');
    logoutButton.click();
    
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('deve implementar OnDestroy', () => {
    spyOn(component, 'ngOnDestroy');
    component.ngOnDestroy();
    expect(component.ngOnDestroy).toHaveBeenCalled();
  });
});
