import { Component } from '@angular/core';
import { browser } from 'webextension-polyfill-ts';
import { SessionModel } from 'src/types/session';
import { PanelOutput } from './session-panel-list/session-panel-list.component';
import { SessionController } from 'src/controller/session-controller';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedSession: PanelOutput;
  width = 800;
  height = 600;

  currentSession: SessionModel;
  previousSessions: Promise<SessionModel[]>;
  savedSessions: Promise<SessionModel[]>;

  constructor(private sessionController: SessionController) { }

  ngOnInit() {
    this.reload().then(() => this.selectedSession = {session: this.currentSession, detailName: "Current Session" });
  }

  reload() {
    this.savedSessions = this.sessionController.getAllSessions(),
      this.previousSessions = this.savedSessions;

    return Promise.all([
      this.sessionController.getCurrentSession().then(s => this.currentSession = s),
      this.savedSessions,
      this.previousSessions]);
  }

  deleteSession(id: number){
      this.sessionController.deleteSession(id).then(() => this.reload());
  }
}
