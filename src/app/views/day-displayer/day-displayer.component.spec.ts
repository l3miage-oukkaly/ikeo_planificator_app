import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayDisplayerComponent } from './day-displayer.component';

describe('DayDisplayerComponent', () => {
  let component: DayDisplayerComponent;
  let fixture: ComponentFixture<DayDisplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayDisplayerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DayDisplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
