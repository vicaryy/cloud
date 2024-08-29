import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragDropControllerComponent } from './drag-drop-controller.component';

describe('DragDropControllerComponent', () => {
  let component: DragDropControllerComponent;
  let fixture: ComponentFixture<DragDropControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragDropControllerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DragDropControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
