import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaakeList } from './laake-list';

describe('LaakeList', () => {
  let component: LaakeList;
  let fixture: ComponentFixture<LaakeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaakeList],
    }).compileComponents();

    fixture = TestBed.createComponent(LaakeList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
