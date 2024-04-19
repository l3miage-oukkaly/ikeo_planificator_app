import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionDeliverymenComponent } from './accordion-deliverymen.component';

describe('AccordionDeliverymenComponent', () => {
  let component: AccordionDeliverymenComponent;
  let fixture: ComponentFixture<AccordionDeliverymenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionDeliverymenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccordionDeliverymenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
