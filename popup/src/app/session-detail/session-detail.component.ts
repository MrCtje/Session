import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SessionModel } from 'src/types/session';
import { PanelOutput } from '../session-panel-list/session-panel-list.component';
import { SessionController } from 'src/controller/session-controller';

@Component({
  selector: 'session-detail',
  templateUrl: './session-detail.component.html',
  styleUrls: ['./session-detail.component.scss']
})
export class SessionDetailComponent implements OnInit {
  @Input() sessionInfo: PanelOutput;
  @Output() sessionSaved: EventEmitter<number> = new EventEmitter();

  get stringify() {
    return JSON.stringify;
  }

  constructor(private sessionController: SessionController) { }

  ngOnInit(): void {
  }

  save(session: SessionModel): void {
    this.sessionController.saveSession(session).then((id) =>
      this.sessionSaved.emit(id)
    );
  }

}
