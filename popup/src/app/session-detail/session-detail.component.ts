import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { SessionModel } from 'src/types/session';
import { SessionController } from 'src/controller/session-controller';
import * as timeago from 'timeago.js';
import { countTabs } from 'src/methods/window';
import { faTimesCircle, faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { PromptModalComponent } from '../modals/prompt-modal/prompt-modal.component';
import { SearchKeys, SearchOutput } from '../session-panel-list/session-search/session-search.component';
import { markString } from 'src/methods/string';
import { MenuItem } from '../settings-menu/settings-menu.component';
import { MatMenu } from '@angular/material/menu';

@Component({
    selector: 'session-detail',
    templateUrl: './session-detail.component.html',
    styleUrls: ['./session-detail.component.scss']
})
export class SessionDetailComponent implements OnInit, OnChanges {
    @ViewChild(PromptModalComponent, { static: true }) prompt: PromptModalComponent;

    @Input() session: SessionModel;
    @Input() searchResult: SearchOutput | null;
    @Output() sessionSaved: EventEmitter<number> = new EventEmitter();

    closeIcon = faTimesCircle;
    incognito = faUserSecret;
    sessionMenu: MenuItem[] = [
        {
            label: "Rename",
            handler: () => { console.log("Rename pending"); }
        },
        {
            label: "Duplicate",
            handler: () => { console.log("Rename pending"); }
        },
        {
            label: "Delete",
            handler: () => { console.log("Delete pending"); }
        },
        {
            isDivider: true
        },
        {
            label: "Sort by title",
            handler: () => { console.log("Delete pending"); }
        },
        {
            label: "Sort by url",
            handler: () => { console.log("Delete pending"); }
        },
        {
            isDivider: true
        },
        {
            label: "Unify windows",
            handler: () => { console.log("Delete pending"); }
        },
        {
            label: "Overwrite with current",
            handler: () => { console.log("Delete pending"); }
        },
        {
            label: "Settings"
        },

    ];

    windowMenu: MenuItem[] = [
        {
            label: "Copy to new session",
            handler: () => { console.log("Rename pending"); }
        },
        {
            label: "Move to new session",
            handler: () => { console.log("Rename pending"); }
        },
        {
            isDivider: true
        },
        {
            label: "Open",
            handler: () => { console.log("Delete pending"); }
        },
        {
            label: "Open incognito",
            handler: () => { console.log("Delete pending"); }
        },
        {
            label: "Open tabs",
            handler: () => { console.log("Delete pending"); }
        },
        {
            isDivider: true
        },
        {
            label: "Rename",
            handler: () => { console.log("Delete pending"); }
        },
        {
            label: "Make incognito",
            handler: () => { console.log("Delete pending"); }
        },
        {
            isDivider: true
        },
        {
            label: "Delete"
        },
    ];

    sessionMenuRef: ElementRef<MatMenu>;
    windowMenuRef: ElementRef<MatMenu>;

    get stringify() {
        return JSON.stringify;
    }

    get ago() {
        return timeago.format;
    }

    constructor(private sessionController: SessionController) { }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        // if (!changes.searchResult) {
        //     return;
        // }

        // const searchResult: SearchOutput | null = changes.searchResult.currentValue;
        // if (searchResult) {
        //     this.mark();
        // }
    }

    mark(title: string, url: string): string {
        const rs = this.searchResult.find(x => x.item.id === this.session.id);
        if (!rs) {
            return title;
        }

        const matches = rs.matches
            .filter(x => x.key === SearchKeys["windows.tabs.title"] || x.key === SearchKeys["windows.tabs.url"]);

        if (!matches) {
            return title;
        }

        console.log(matches);
        const match = matches.find(x => x.value === title);
        if (!match) {
            const urlMatch = matches.find(x => x.value === url);
            if (urlMatch) {
                // Mark whole string
                return "<span class='mark'>" + title + "</span>";
            }

            return title;
        }

        return markString(title,
            "<span class='mark'>",
            "</span>",
            match.indices as any);
    }

    save(session: SessionModel): void {
        this.prompt.openModal({ defaultAnswer: "Unnamed Session", question: "Name", title: "Saving Session" })
            .subscribe((name) => {
                session.name = name;
                session.type = "Saved";
                this.sessionController.saveSession(session).then((id) =>
                    this.sessionSaved.emit(id)
                );
            });
    }

    editName(session: SessionModel): void {
        this.prompt.openModal({ defaultAnswer: "Unnamed Session", answer: session.name, question: "Name", title: "Edit Name" })
            .subscribe((name) => {
                session.name = name;
                this.sessionController.updateSession({ id: session.id, name }).then((id) =>
                    this.sessionSaved.emit(id)
                );
            });
    }

    open(session: SessionModel): void {
        this.sessionController.restoreSession(session.id);
    }

    openWindow(sessionId: number, windowId: number): void {
        if (sessionId) {
            this.sessionController.restoreWindow(sessionId, windowId);
        } else {
            this.sessionController.focusWindow(windowId);
        }
    }

    deleteTab(sessionId: number, windowId: number, tabId: number) {
        this.sessionController.deleteTab(sessionId, windowId, tabId).then(
            () => this.sessionSaved.emit(sessionId)
        );
    }

    toDateString(session: SessionModel) {
        return new Date(session.date.toString()).toLocaleString();
    }

    getStats(session: SessionModel) {
        return `${session.windows.length} Windows  ${countTabs(session)} Tabs`
    }

}
