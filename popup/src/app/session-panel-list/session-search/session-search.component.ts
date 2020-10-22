import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import Fuse from "fuse.js";
import { SessionModel } from 'src/types/session';

export type SearchOutput = Fuse.FuseResult<SessionModel>[];
export enum SearchKeys {
    "name" = "name",
    "windows.tabs.url" = "windows.tabs.url",
    "windows.tabs.title" = "windows.tabs.title"
};

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
    minMatchCharLength = 3;

    constructor() { }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.sessionSearchList.firstChange) {
            const allsSessions = changes.sessionSearchList.currentValue as SessionModel[];
            const keys = Object.getOwnPropertyNames(SearchKeys);

            this.fuse = new Fuse<SessionModel>(allsSessions,
                {
                    keys: keys,
                    includeMatches: true,
                    minMatchCharLength: this.minMatchCharLength,
                    threshold: 0.3
                });
        } else {
            this.fuse.setCollection(changes.sessionSearchList.currentValue as SessionModel[]);
        }
    }

    typed(e) {
        clearTimeout(this.debounceId);
        this.debounceId = setTimeout(() => {
            const trimmedInput = e.srcElement.value.trim();
            if (trimmedInput.length < this.minMatchCharLength) {
                this.searchResult.emit();
                return;
            }
            const result = this.fuse.search(e.srcElement.value);
            if (!trimmedInput) {
                this.searchResult.emit();
            } else {
                this.searchResult.emit(result);
            }
        }, 500);
    }

}
