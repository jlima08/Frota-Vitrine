import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioMovimentacoesComponent } from './relatorio-movimentacoes.component';

describe('RelatorioMovimentacoesComponent', () => {
  let component: RelatorioMovimentacoesComponent;
  let fixture: ComponentFixture<RelatorioMovimentacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioMovimentacoesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioMovimentacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
