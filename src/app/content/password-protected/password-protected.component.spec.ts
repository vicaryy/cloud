import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordProtectedComponent } from './password-protected.component';

describe('PasswordProtectedComponent', () => {
  let component: PasswordProtectedComponent;
  let fixture: ComponentFixture<PasswordProtectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordProtectedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordProtectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
