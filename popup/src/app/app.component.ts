import { Component } from '@angular/core';
import { SessionModel } from 'src/types/session';
import { SessionController } from 'src/controller/session-controller';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    selectedSession: SessionModel;
    currentSession: SessionModel;
    allSessions: SessionModel[];

    constructor(private sessionController: SessionController) { }

    ngOnInit() {
        this.reload().then(() => this.selectedSession = this.currentSession);
    }

    async reload() {
        this.allSessions = await this.sessionController.getAllSessions();
        this.currentSession = await this.sessionController.getCurrentSession();
        this.allSessions = [...this.allSessions, this.currentSession];
    }

    deleteSession(id: number) {
        this.sessionController.deleteSession(id).then(() => this.reload());
    }
}
