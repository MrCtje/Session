import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import Fuse from "fuse.js";
import { SessionModel } from 'src/types/session';

export type SearchOutput = Fuse.FuseResult<SessionModel>[];

@Component({
    selector: 'session-search',
    templateUrl: './session-search.component.html',
    styleUrls: ['./session-search.component.scss']
})
export class SessionSearchComponent implements OnInit, OnChanges {
    @Output() searchResult: EventEmitter<SearchOutput | null> = new EventEmitter();
    @Input() sessionSearchList: SessionModel[];
    fuse: Fuse<SessionModel>;
    debounceId;

    constructor() { }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.sessionSearchList.firstChange) {
            const allsSessions = changes.sessionSearchList.currentValue as SessionModel[];
            this.fuse = new Fuse<SessionModel>(allsSessions,
                {
                    keys: ["name", "windows.title", "windows.tabs.url", "windows.tabs.title"],
                    includeMatches: true,
                    distance: 5
                });
        } else {
            this.fuse.setCollection(changes.sessionSearchList.currentValue as SessionModel[]);
        }
    }

    typed(e) {
        clearTimeout(this.debounceId);
        this.debounceId = setTimeout(() => {
            const result = this.fuse.search(e.srcElement.value);
            if(!e.srcElement.value.trim()) {
                this.searchResult.emit();
            } else {
                this.searchResult.emit(result);
            }
        }, 500);
    }

}
