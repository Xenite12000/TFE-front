import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendriereleveComponent } from './calendriereleve.component';

describe('CalendriereleveComponent', () => {
  let component: CalendriereleveComponent;
  let fixture: ComponentFixture<CalendriereleveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendriereleveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendriereleveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
