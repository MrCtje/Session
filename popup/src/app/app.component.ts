import { Component } from '@angular/core';
import { SessionModel } from 'src/types/session';
import { SessionController } from 'src/controller/session-controller';
import { SearchOutput } from './session-panel-list/session-search/session-search.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    selectedSession: SessionModel;
    currentSession: SessionModel;
    allSessions: SessionModel[];

    searchResult: SearchOutput | null;


    constructor(private sessionController: SessionController) { }

    ngOnInit() {
        this.reload().then(() => this.selectedSession = this.currentSession);
    }

    async reload(selectedSession?: number) {
        this.allSessions = await this.sessionController.getAllSessions();
        this.currentSession = await this.sessionController.getCurrentSession();
        this.allSessions = [...this.allSessions, this.currentSession];

        if (selectedSession) {
            this.selectedSession = this.allSessions.find(s => s.id === selectedSession) || this.selectedSession;
        }
    }

    deleteSession(id: number) {
        this.sessionController.deleteSession(id).then(() => this.reload());
    }
}
