import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateBorrowComponent } from './calculate-borrow.component';

describe('CalculateBorrowComponent', () => {
  let component: CalculateBorrowComponent;
  let fixture: ComponentFixture<CalculateBorrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculateBorrowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculateBorrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
