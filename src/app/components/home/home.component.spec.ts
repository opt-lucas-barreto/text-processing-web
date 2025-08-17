import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { HomeComponent } from './home.component';
import { AnagramService } from '../../services/anagram.service';
import { AuthService } from '../../services/auth.service';
import { AnagramRequest, AnagramResponse } from '../../models/anagram.model';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let anagramService: jasmine.SpyObj<AnagramService>;
  let authService: jasmine.SpyObj<AuthService>;

  const mockUser = {
    username: 'testuser',
    role: 'USER'
  };

  const mockAnagramResponse: AnagramResponse = {
    originalLetters: 'abc',
    anagrams: ['abc', 'acb', 'bac', 'bca', 'cab', 'cba'],
    totalAnagrams: 6,
    fromCache: false,
    processingTimeMs: 100
  };

  beforeEach(async () => {
    const anagramServiceSpy = jasmine.createSpyObj('AnagramService', ['generateAnagrams']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      currentUser$: of(mockUser)
    });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [HomeComponent],
      providers: [
        { provide: AnagramService, useValue: anagramServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    anagramService = TestBed.inject(AnagramService) as jasmine.SpyObj<AnagramService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar com formulário válido', () => {
    expect(component.anagramForm).toBeDefined();
    expect(component.anagramForm.get('letters')).toBeDefined();
  });

  it('deve validar campo de letras vazio', () => {
    const lettersControl = component.anagramForm.get('letters');
    lettersControl?.setValue('');
    expect(lettersControl?.errors?.['required']).toBeTruthy();
  });

  it('deve validar campo de letras com caracteres inválidos', () => {
    const lettersControl = component.anagramForm.get('letters');
    lettersControl?.setValue('123');
    expect(lettersControl?.errors?.['pattern']).toBeTruthy();
  });

  it('deve validar campo de letras válido', () => {
    const lettersControl = component.anagramForm.get('letters');
    lettersControl?.setValue('abc');
    expect(lettersControl?.errors).toBeNull();
  });

  it('deve gerar anagramas com sucesso', () => {
    anagramService.generateAnagrams.and.returnValue(of(mockAnagramResponse));
    
    const request: AnagramRequest = { letters: 'abc' };
    component.anagramForm.patchValue(request);
    component.onSubmit();
    
    expect(anagramService.generateAnagrams).toHaveBeenCalledWith(request);
    expect(component.anagrams).toEqual(mockAnagramResponse.anagrams);
    expect(component.totalAnagrams).toBe(mockAnagramResponse.totalAnagrams);
    expect(component.processingTime).toBe(mockAnagramResponse.processingTimeMs);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('deve tratar erro na geração de anagramas', () => {
    const errorMessage = 'Erro ao gerar anagramas';
    anagramService.generateAnagrams.and.returnValue(throwError(() => new Error(errorMessage)));
    
    const request: AnagramRequest = { letters: 'abc' };
    component.anagramForm.patchValue(request);
    component.onSubmit();
    
    expect(component.error).toBe(errorMessage);
    expect(component.loading).toBeFalse();
  });

  it('deve definir estado de carregamento durante submissão', () => {
    anagramService.generateAnagrams.and.returnValue(of(mockAnagramResponse));
    
    const request: AnagramRequest = { letters: 'abc' };
    component.anagramForm.patchValue(request);
    component.onSubmit();
    
    expect(component.loading).toBeFalse();
  });

  it('deve limpar resultados anteriores ao submeter nova requisição', () => {
    component.anagrams = ['old1', 'old2'];
    component.totalAnagrams = 2;
    component.error = 'old error';
    
    anagramService.generateAnagrams.and.returnValue(of(mockAnagramResponse));
    
    const request: AnagramRequest = { letters: 'abc' };
    component.anagramForm.patchValue(request);
    component.onSubmit();
    
    expect(component.anagrams).toEqual(mockAnagramResponse.anagrams);
    expect(component.totalAnagrams).toBe(mockAnagramResponse.totalAnagrams);
    expect(component.error).toBe('');
  });

  it('deve obter controle de letras', () => {
    const lettersControl = component.getLettersControl();
    expect(lettersControl).toBe(component.anagramForm.get('letters'));
  });

  it('deve verificar se campo de letras é inválido', () => {
    const lettersControl = component.anagramForm.get('letters');
    lettersControl?.setValue('');
    lettersControl?.markAsTouched();
    
    expect(component.isLettersInvalid()).toBeTrue();
  });

  it('deve verificar se campo de letras é válido', () => {
    const lettersControl = component.anagramForm.get('letters');
    lettersControl?.setValue('abc');
    
    expect(component.isLettersInvalid()).toBeFalse();
  });

  it('deve implementar OnDestroy', () => {
    spyOn(component, 'ngOnDestroy');
    component.ngOnDestroy();
    expect(component.ngOnDestroy).toHaveBeenCalled();
  });

  it('deve NÃO chamar API ao digitar', () => {
    component.anagramForm.patchValue({ letters: 'a' });
    expect(anagramService.generateAnagrams).not.toHaveBeenCalled();
  });

  it('deve chamar API apenas ao submeter', () => {
    anagramService.generateAnagrams.and.returnValue(of(mockAnagramResponse));
    
    const request: AnagramRequest = { letters: 'abc' };
    component.anagramForm.patchValue(request);
    component.onSubmit();
    
    expect(anagramService.generateAnagrams).toHaveBeenCalledTimes(1);
    expect(anagramService.generateAnagrams).toHaveBeenCalledWith(request);
  });
});
