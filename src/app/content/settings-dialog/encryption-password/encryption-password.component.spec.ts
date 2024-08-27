import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncryptionPasswordComponent } from './encryption-password.component';

describe('EncryptionPasswordComponent', () => {
  let component: EncryptionPasswordComponent;
  let fixture: ComponentFixture<EncryptionPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncryptionPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EncryptionPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
