import { Component, Input, OnInit } from '@angular/core';
import { SessionModel } from 'src/types/session';
import * as timeago from 'timeago.js';

@Component({
    selector: 'session-card',
    templateUrl: './session-card.component.html',
    styleUrls: ['./session-card.component.scss']
})
export class SessionCardComponent implements OnInit {
    @Input() session: SessionModel;
    isActive: boolean;

    constructor() { }

    get ago() {
        return timeago.format;
    }

    ngOnInit(): void {
    }

    countTabs(session: SessionModel) {
        return session.windows
            .map((w) => w.tabs.length)
            .reduce((accum, current) => accum + current);
    }

    displayTabCount(session: SessionModel) {
        const count = this.countTabs(session);
        return count + (count > 1 ? " Tabs" : " Tab");
    }

    setActive(isActive: boolean) {
        this.isActive = isActive;
    }

}
