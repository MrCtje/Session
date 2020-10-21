import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { countTabs } from 'src/methods/window';
import { SessionModel } from 'src/types/session';
import * as timeago from 'timeago.js';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'session-card',
    templateUrl: './session-card.component.html',
    styleUrls: ['./session-card.component.scss']
})
export class SessionCardComponent implements OnInit {
    closeIcon = faTimesCircle;
    @Input() session: SessionModel;
    @Output() onSessionDelete: EventEmitter<number> = new EventEmitter();
    isActive: boolean;

    constructor() { }

    get ago() {
        return timeago.format;
    }

    ngOnInit(): void {
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
