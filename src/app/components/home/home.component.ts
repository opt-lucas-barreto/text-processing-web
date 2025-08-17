import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AnagramService } from '../../services/anagram.service';
import { AuthService } from '../../services/auth.service';
import { AnagramRequest, AnagramResponse } from '../../models/anagram.model';
import { User } from '../../models/auth.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  anagramForm: FormGroup;
  anagrams: string[] = [];
  totalAnagrams: number = 0;
  processingTime: number = 0;
  fromCache: boolean = false;
  loading: boolean = false;
  error: string | null = null;
  useCache: boolean = true;
  currentUser: User | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private anagramService: AnagramService,
    private authService: AuthService,
    private router: Router
  ) {
    this.anagramForm = this.fb.group({
      letters: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        if (!user) {
          this.router.navigate(['/login']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.anagramForm.valid) {
      const letters = this.anagramForm.get('letters')?.value.trim();
      if (letters) {
        this.generateAnagrams(letters);
      }
    }
  }

  private generateAnagrams(letters: string): void {
    this.loading = true;
    this.error = null;
    this.clearResults();

    const request: AnagramRequest = { letters };

    const serviceCall = this.useCache 
      ? this.anagramService.generateAnagrams(request)
      : this.anagramService.generateAnagramsWithoutCache(request);

    serviceCall.subscribe({
      next: (response: AnagramResponse) => {
        this.anagrams = response.anagrams;
        this.totalAnagrams = response.totalAnagrams;
        this.processingTime = response.processingTimeMs;
        this.fromCache = response.fromCache;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao gerar anagramas. Tente novamente.';
        this.loading = false;
        console.error('Erro ao gerar anagramas:', err);
      }
    });
  }

  toggleCache(): void {
    this.useCache = !this.useCache;
    console.log('Cache ' + (this.useCache ? 'ativado' : 'desativado'));
  }

  private clearResults(): void {
    this.anagrams = [];
    this.totalAnagrams = 0;
    this.processingTime = 0;
    this.fromCache = false;
  }

  trackByIndex(index: number): number {
    return index;
  }

  getLettersControl() {
    return this.anagramForm.get('letters');
  }

  isLettersInvalid(): boolean {
    const control = this.getLettersControl();
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}
