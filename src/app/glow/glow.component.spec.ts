import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlowComponent } from './glow.component';

describe('GlowComponent', () => {
  let component: GlowComponent;
  let fixture: ComponentFixture<GlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
