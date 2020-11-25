import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsMenuComponent } from './options-contextmenu.component';

describe('SettingsMenuComponent', () => {
  let component: SettingsMenuComponent;
  let fixture: ComponentFixture<SettingsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
