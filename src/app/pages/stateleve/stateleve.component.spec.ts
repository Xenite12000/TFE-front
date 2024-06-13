import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateleveComponent } from './stateleve.component';

describe('StateleveComponent', () => {
  let component: StateleveComponent;
  let fixture: ComponentFixture<StateleveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateleveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StateleveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
