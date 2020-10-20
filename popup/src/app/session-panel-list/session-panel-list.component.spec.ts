import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionPanelListComponent } from './session-panel-list.component';

describe('SessionPanelListComponent', () => {
  let component: SessionPanelListComponent;
  let fixture: ComponentFixture<SessionPanelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionPanelListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionPanelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
