import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptySearchComponent } from './empty-search.component';

describe('EmptySearchComponent', () => {
  let component: EmptySearchComponent;
  let fixture: ComponentFixture<EmptySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptySearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmptySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
