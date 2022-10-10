import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaisDetalhesComponent } from './mais-detalhes.component';

describe('MaisDetalhesComponent', () => {
  let component: MaisDetalhesComponent;
  let fixture: ComponentFixture<MaisDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaisDetalhesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaisDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
