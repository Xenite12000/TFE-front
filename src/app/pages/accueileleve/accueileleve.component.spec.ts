import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueileleveComponent } from './accueileleve.component';

describe('AccueileleveComponent', () => {
  let component: AccueileleveComponent;
  let fixture: ComponentFixture<AccueileleveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueileleveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccueileleveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
