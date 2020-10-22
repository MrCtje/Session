import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { SessionModel } from 'src/types/session';
import { SessionCardComponent } from './session-card/session-card.component';
import { SearchOutput } from './session-search/session-search.component';
import Fuse from "fuse.js";

@Component({
    selector: 'session-panel-list',
    templateUrl: './session-panel-list.component.html',
    styleUrls: ['./session-panel-list.component.scss']
})
export class SessionPanelListComponent implements OnInit {
    @Output() selectionChanged: EventEmitter<SessionModel> = new EventEmitter();
    @Output() onSessionDelete: EventEmitter<SessionModel> = new EventEmitter();
    @Output() onSearchResult: EventEmitter<SearchOutput | null> = new EventEmitter();

    oldSelection: SessionCardComponent;

    @Input() allSessions: SessionModel[];

    currentSessionName = "Current Session";
    backupSessionName = "Backup Sessions";

    searchSessions: SessionModel[];
    searchResult: SearchOutput | null;

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

    filterSearchResult(searchResult?: SearchOutput) {
        this.searchSessions = searchResult?.map(s => s.item);
        this.searchResult = searchResult;

        this.onSearchResult.emit(searchResult);
    }
}
