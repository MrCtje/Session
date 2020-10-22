import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SessionModel } from 'src/types/session';
import { SessionCardComponent } from './session-card/session-card.component';
import { SearchOutput } from './session-search/session-search.component';

@Component({
    selector: 'session-panel-list',
    templateUrl: './session-panel-list.component.html',
    styleUrls: ['./session-panel-list.component.scss']
})
export class SessionPanelListComponent implements OnInit {
    @Output() selectionChanged: EventEmitter<SessionModel> = new EventEmitter();
    @Output() onSessionDelete: EventEmitter<SessionModel> = new EventEmitter();

    oldSelection: SessionCardComponent;

    @Input() allSessions: SessionModel[];

    currentSessionName = "Current Session";
    backupSessionName = "Backup Sessions";

    searchResult: SessionModel[];

    constructor() { }

    ngOnInit(): void {

    }

    setActive(session: SessionModel, comp: SessionCardComponent): void {
        comp.setActive(true);
        if (this.oldSelection && this.oldSelection !== comp) {
            this.oldSelection.setActive(false);
        }
        this.oldSelection = comp;
        this.selectionChanged.emit(session);
    }

    filterSearchResult(sessions?: SearchOutput) {
        this.searchResult = sessions?.map(s => s.item);
        console.log(sessions);
    }

}
