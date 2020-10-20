import { Component, OnInit } from '@angular/core';
import { SessionModel } from 'src/types/session';
import { browser } from 'webextension-polyfill-ts';

@Component({
  selector: 'session-panel-list',
  templateUrl: './session-panel-list.component.html',
  styleUrls: ['./session-panel-list.component.scss']
})
export class SessionPanelListComponent implements OnInit {
  currentSession: SessionModel;
  previousSessions: Promise<SessionModel[]>;
  savedSessions: Promise<SessionModel[]>;

  constructor() { }

  ngOnInit(): void {
    browser.runtime.sendMessage({ func: "getCurrentSession" }).then(s => this.currentSession = s);
    this.savedSessions = browser.runtime.sendMessage({ func: "getAllSessions" });
    this.previousSessions = this.savedSessions;
  }

}
