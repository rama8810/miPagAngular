import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeDashboardComponent } from './exchange-dashboard.component';

describe('ExchangeDashboardComponent', () => {
  let component: ExchangeDashboardComponent;
  let fixture: ComponentFixture<ExchangeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchangeDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExchangeDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
