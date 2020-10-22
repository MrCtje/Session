import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { countTabs } from 'src/methods/window';
import { SessionModel } from 'src/types/session';
import * as timeago from 'timeago.js';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { SearchKeys, SearchOutput } from '../session-search/session-search.component';
import { nameof } from 'src/methods/nameof';
import { off } from 'process';
import { markString } from 'src/methods/string';

@Component({
    selector: 'session-card',
    templateUrl: './session-card.component.html',
    styleUrls: ['./session-card.component.scss']
})
export class SessionCardComponent implements OnInit, OnChanges {
    closeIcon = faTimesCircle;
    @Input() session: SessionModel;
    @Input() searchResult: SearchOutput | null;
    @Output() onSessionDelete: EventEmitter<number> = new EventEmitter();
    isActive: boolean;

    sessionName: string;

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.searchResult) {
            return;
        }

        const searchResult: SearchOutput | null = changes.searchResult.currentValue;
        if (searchResult) {
            this.mark(searchResult);
        }
    }

    get ago() {
        return timeago.format;
    }

    ngOnInit(): void {
        const session = this.session;

        this.sessionName = session.name ? session.name : "Changed " + this.ago(session.date);

        const searchResult: SearchOutput | null = this.searchResult;
        if (searchResult) {
            this.mark(searchResult);
        }
    }

    mark(searchResult: SearchOutput) {
        const rs = searchResult.find(x => x.item.id === this.session.id);
        if (!rs) {
            return;
        }

        const match = rs.matches.find(x => x.key === SearchKeys.name);
        if (!match) {
            return;
        }

        this.sessionName = markString(this.session.name,
            "<span class='mark'>",
            "</span>",
            match.indices as any);
    }

    displayTabCount(session: SessionModel) {
        const count = countTabs(session);
        return count + (count > 1 ? " Tabs" : " Tab");
    }

    setActive(isActive: boolean) {
        this.isActive = isActive;
    }

    deleteSession(event) {
        event.stopPropagation();
        this.onSessionDelete.emit(this.session.id);
        return false;
    }

}
