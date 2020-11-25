import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { SessionModel } from 'src/types/session';
import { SessionController } from 'src/controller/session-controller';
import * as timeago from 'timeago.js';
import { countTabs } from 'src/methods/window';
import { faPuzzlePiece, faTimesCircle, faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { PromptModalComponent } from '../modals/prompt-modal/prompt-modal.component';
import { SearchKeys, SearchOutput } from '../session-panel-list/session-search/session-search.component';
import { markString } from 'src/methods/string';
import { MatMenu } from '@angular/material/menu';
import { WindowModel } from 'src/types/window';
import { TabModel } from 'src/types/tab';
import { MenuItem } from '../options-contextmenu/options-contextmenu.component';
import { SettingsMenuComponent } from '../modals/settings-menu/settings-menu.component';
import { ExportModalComponent } from '../modals/export-modal/export-modal.component';
import { ImportModalComponent } from '../modals/import-modal/import-modal.component';

@Component({
    selector: 'session-detail',
    templateUrl: './session-detail.component.html',
    styleUrls: ['./session-detail.component.scss']
})
export class SessionDetailComponent implements OnInit, OnChanges {
    @ViewChild(PromptModalComponent, { static: true }) prompt: PromptModalComponent;
    @ViewChild(ExportModalComponent, { static: true }) exportModal: ExportModalComponent;
    @ViewChild(ImportModalComponent, { static: true }) importModal: ImportModalComponent;
    @ViewChild(SettingsMenuComponent, { static: true }) settings: SettingsMenuComponent;

    @Input() session: SessionModel;
    @Input() searchResult: SearchOutput | null;
    @Output() sessionSaved: EventEmitter<number> = new EventEmitter();

    closeIcon = faTimesCircle;
    incognito = faUserSecret;
    extensionIcon = faPuzzlePiece;

    sortTabByProp: keyof TabModel = "index";

    sessionMenu: MenuItem[] = [
        {
            label: "Rename",
            handler: () => this.editName(this.session)
        },
        {
            label: "Duplicate",
            handler: () => this.save(this.session)
        },
        {
            label: "Delete",
            handler: () => this.deleteSession(this.session.id)

        },
        {
            isDivider: true
        },
        {
            label: "Import session",
            handler: () => this.importModal.openModal("session").subscribe(sessionString =>
                this.save(JSON.parse(sessionString))
            )
        },
        {
            label: "Export session",
            handler: () => this.exportModal.openModal(JSON.stringify(this.session)).subscribe()

        },
        {
            isDivider: true
        },
        {
            label: "Sort by title [WIP]",
            handler: () => this.sortTabByProp = "title"
        },
        {
            label: "Sort by url [WIP]",
            handler: () => this.sortTabByProp = "url"
        },
        {
            isDivider: true
        },
        {
            label: "Unify windows",
            handler: () => this.unifyWindows()
        },
        {
            label: "Overwrite with current",
            handler: () => this.overwriteWithCurrent(this.session.id)
        },
        {
            label: "Settings",
            handler: () => this.settings.openModal().subscribe()
        },

    ];

    windowMenu: MenuItem[] = [
        {
            label: "Copy to new session",
            handler: (window: WindowModel) => this.copyWindowToNewSession(window)
        },
        {
            label: "Move to new session",
            handler: (window: WindowModel) => this.moveWindowToNewSession(this.session, window)
        },
        {
            isDivider: true
        },
        {
            label: "Open",
            handler: (window: WindowModel) => this.openWindow(this.session.id, window.id)
        },
        {
            label: "Open incognito",
            handler: (window: WindowModel) => this.openWindowInIncognito(this.session.id, window.id)
        },
        {
            label: "Open tabs [WIP]",
            handler: () => console.log("Delete pending")
        },
        {
            isDivider: true
        },
        {
            label: "Export window",
            handler: (window: WindowModel) => this.exportModal.openModal(JSON.stringify(window)).subscribe()
        },
        {
            isDivider: true
        },
        // {
        //     label: "Rename [WIP]",
        //     handler: () => { console.log("Delete pending"); }
        // },
        {
            label: "Make incognito [Works partially]",
            handler: (window: WindowModel) => this.makeWindowIncognito(this.session.id, window.id)
        },
        {
            isDivider: true
        },
        {
            label: "Delete",
            handler: (window: WindowModel) => this.deleteWindow(this.session, window.id)
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

    async save(session: SessionModel): Promise<number> {
        return new Promise((res, rej) => {
            this.prompt.openModal({ defaultAnswer: "Unnamed Session", question: "Name", title: "Saving Session" })
                .subscribe((name) => {
                    session.name = name;
                    session.type = "Saved";
                    this.sessionController.saveSession(session).then((id) => {
                        this.sessionSaved.emit(id);
                        res(id);
                    });
                });
        });
    }

    copyWindowToNewSession(window: WindowModel): Promise<number> {
        const session: SessionModel = {
            id: null,
            date: new Date(),
            windows: [window]
        } as SessionModel;
        return this.save(session);
    }

    moveWindowToNewSession(session: SessionModel, window: WindowModel): void {
        this.copyWindowToNewSession(window)
            .then(() => this.deleteWindow(session, window.id));
    }

    editName(session: SessionModel): void {
        this.prompt.openModal({ defaultAnswer: "Unnamed Session", answer: session.name, question: "Name", title: "Edit Name" })
            .subscribe((name) => {
                session.name = name;
                this.sessionController.updateSession({ id: session.id, name }).then(() =>
                    this.sessionSaved.emit(session.id)
                );
            });
    }

    open(session: SessionModel): void {
        this.sessionController.restoreSession(session.id);
    }

    openWindow(sessionId: number | null, windowId: number): void {
        if (sessionId) {
            this.sessionController.restoreWindow(sessionId, windowId);
        } else {
            this.sessionController.focusWindow(windowId);
        }
    }

    openWindowInIncognito(sessionId: number, windowId: number) {
        this.openWindowWith(sessionId, windowId, { incognito: true });
    }

    overwriteWithCurrent(sessionToOverwrite: number) {
        this.sessionController.getCurrentSession().then((session: SessionModel) => {
            this.sessionController.updateSession({ id: sessionToOverwrite, windows: session.windows })
                .then(() => this.sessionSaved.emit(sessionToOverwrite));
        });
    }

    unifyWindows() {
        const sessionId = this.session.id;
        const getUnifiedWindow = (incognito: boolean) => {
            const filterWindows = this.session.windows
                .filter(w => w.incognito === incognito);

            if (filterWindows.length === 0)
                return null;

            return filterWindows.reduce((current, accum) => {
                accum.tabs.push(...current.tabs);
                return accum;
            });
        };

        const incognitoWindow = getUnifiedWindow(true);
        const normalWindow = getUnifiedWindow(false);

        const windows = [];

        if (incognitoWindow) {
            windows.push(incognitoWindow);
        }

        if (normalWindow) {
            windows.push(normalWindow);
        }

        this.sessionController.updateSession({ id: sessionId, windows })
            .then(() => this.sessionSaved.emit(sessionId));
    }

    makeWindowIncognito(sessionId: number, windowId: number) {
        this.updateWindow(sessionId, windowId, { incognito: true });
    }

    openWindowWith(sessionId: number, windowId: number, propertyChanges: Partial<WindowModel>): void {
        if (sessionId) {
            this.sessionController.restoreWindowWith(sessionId, windowId, propertyChanges);
        }
    }

    updateWindow(sessionId: number, windowId: number, propertyChanges: Partial<WindowModel>) {
        if (sessionId) {
            this.sessionController.updateWindow(sessionId, windowId, propertyChanges)
                .then(() => this.sessionSaved.emit(sessionId));
        }
    }

    deleteWindow(session: SessionModel, windowId: number) {
        const windows = session.windows.filter(w => w.id !== windowId);
        const sessionId = session.id;
        this.sessionController.updateSession({ id: sessionId, windows }).then(
            () => this.sessionSaved.emit(sessionId)
        );
    }

    deleteTab(sessionId: number, windowId: number, tabId: number) {
        this.sessionController.deleteTab(sessionId, windowId, tabId).then(
            () => this.sessionSaved.emit(sessionId)
        );
    }

    deleteSession(sessionId: number) {
        this.sessionController.deleteSession(sessionId).then(
            () => this.sessionSaved.emit()
        );
    }

    toDateString(session: SessionModel) {
        return new Date(session.date.toString()).toLocaleString();
    }

    getStats(session: SessionModel) {
        return `${session.windows.length} Windows  ${countTabs(session)} Tabs`
    }

    isExtensionUrl(url: string) {
        // return url.startsWith("chrome-extension://");
        return !Boolean(url);
    }

}
