import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubredditSelectComponent } from './subreddit-select.component';

describe('SubredditSelectComponent', () => {
  let component: SubredditSelectComponent;
  let fixture: ComponentFixture<SubredditSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubredditSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubredditSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
