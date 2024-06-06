import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertNameComponent } from './alert-name.component';

describe('AlertNameComponent', () => {
  let component: AlertNameComponent;
  let fixture: ComponentFixture<AlertNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertNameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlertNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
