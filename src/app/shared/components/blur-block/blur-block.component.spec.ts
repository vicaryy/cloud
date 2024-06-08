import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlurBlockComponent } from './blur-block.component';

describe('BlurBlockComponent', () => {
  let component: BlurBlockComponent;
  let fixture: ComponentFixture<BlurBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlurBlockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlurBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
