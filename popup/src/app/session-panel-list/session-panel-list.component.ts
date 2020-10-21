import { Component, OnInit, Output, EventEmitter, ElementRef, Input } from '@angular/core';
import { SessionModel } from 'src/types/session';
import { SessionController } from 'src/controller/session-controller';
import { browser } from 'webextension-polyfill-ts';
import { SessionCardComponent } from './session-card/session-card.component';

export interface PanelOutput {
  session: SessionModel;
  detailName: string;
}

@Component({
  selector: 'session-panel-list',
  templateUrl: './session-panel-list.component.html',
  styleUrls: ['./session-panel-list.component.scss']
})
export class SessionPanelListComponent implements OnInit {
  @Output() selectionChanged: EventEmitter<PanelOutput> = new EventEmitter();
  @Output() onSessionDelete: EventEmitter<PanelOutput> = new EventEmitter();

  oldSelection: SessionCardComponent;

  @Input() currentSession: SessionModel;
  @Input() previousSessions: Promise<SessionModel[]>;
  @Input() savedSessions: Promise<SessionModel[]>;

  currentSessionName = "Current Session";
  previousSessionName = "Previous Sessions";

  constructor() { }

  ngOnInit(): void {

  }

  setActive(session: SessionModel, comp: SessionCardComponent, detailName: string): void {
    comp.setActive(true);
    if (this.oldSelection && this.oldSelection !== comp) {
      this.oldSelection.setActive(false);
    }
    this.oldSelection = comp;
    this.selectionChanged.emit({ session, detailName });
  }

}
