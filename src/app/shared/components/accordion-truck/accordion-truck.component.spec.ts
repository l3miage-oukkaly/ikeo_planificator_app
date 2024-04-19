import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionTruckComponent } from './accordion-truck.component';

describe('AccordionTruckComponent', () => {
  let component: AccordionTruckComponent;
  let fixture: ComponentFixture<AccordionTruckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionTruckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccordionTruckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
