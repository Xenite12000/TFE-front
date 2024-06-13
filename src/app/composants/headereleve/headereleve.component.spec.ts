import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadereleveComponent } from './headereleve.component';

describe('HeadereleveComponent', () => {
  let component: HeadereleveComponent;
  let fixture: ComponentFixture<HeadereleveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadereleveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeadereleveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
