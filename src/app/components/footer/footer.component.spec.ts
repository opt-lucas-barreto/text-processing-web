import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir nome do autor', () => {
    const nameElement = fixture.nativeElement.querySelector('.name');
    expect(nameElement.textContent).toContain('Lucas B Barreto');
  });

  it('deve exibir número de telefone', () => {
    const phoneElement = fixture.nativeElement.querySelector('.phone');
    expect(phoneElement.textContent).toContain('+55 27 99740 2875');
  });

  it('deve exibir endereço de e-mail', () => {
    const emailElement = fixture.nativeElement.querySelector('.email');
    expect(emailElement.textContent).toContain('lucasbbarreto2@gmail.com');
  });

  it('deve ter estrutura correta do rodapé', () => {
    const footer = fixture.nativeElement.querySelector('.footer');
    const footerContent = fixture.nativeElement.querySelector('.footer-content');
    const footerInfo = fixture.nativeElement.querySelector('.footer-info');
    
    expect(footer).toBeTruthy();
    expect(footerContent).toBeTruthy();
    expect(footerInfo).toBeTruthy();
  });
});
