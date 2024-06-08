import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertNewBagComponent } from './alert-new-bag.component';

describe('AlertNewBagComponent', () => {
  let component: AlertNewBagComponent;
  let fixture: ComponentFixture<AlertNewBagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertNewBagComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlertNewBagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
