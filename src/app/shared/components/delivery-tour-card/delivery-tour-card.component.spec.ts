import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryTourCardComponent } from './delivery-tour-card.component';

describe('DeliveryTourCardComponent', () => {
  let component: DeliveryTourCardComponent;
  let fixture: ComponentFixture<DeliveryTourCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryTourCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeliveryTourCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
