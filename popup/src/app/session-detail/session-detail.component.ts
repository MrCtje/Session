import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SessionModel } from 'src/types/session';
import { PanelOutput } from '../session-panel-list/session-panel-list.component';
import { SessionController } from 'src/controller/session-controller';
import * as timeago from 'timeago.js';
import { countTabs } from 'src/methods/window';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { PromptModalComponent } from '../modals/prompt-modal/prompt-modal.component';

@Component({
    selector: 'session-detail',
    templateUrl: './session-detail.component.html',
    styleUrls: ['./session-detail.component.scss']
})
export class SessionDetailComponent implements OnInit {
    @ViewChild(PromptModalComponent, {static: true}) prompt: PromptModalComponent;

    incognito = faUserSecret;
    @Input() sessionInfo: PanelOutput;
    @Output() sessionSaved: EventEmitter<number> = new EventEmitter();

    get stringify() {
        return JSON.stringify;
    }

    get ago() {
        return timeago.format;
    }

    constructor(private sessionController: SessionController) { }

    ngOnInit(): void {
    }

    save(session: SessionModel): void {
        // this.modalService.addModal(PromptModalComponent,
        //     { defaultAnswer: "Unnamed Session", question: "Name", title: "Saving Session" },
        //     { closeOnClickOutside: false })
        //     .subscribe((name) => {
        //         session.name = name;
        //         this.sessionController.saveSession(session).then((id) =>
        //             this.sessionSaved.emit(id)
        //         );
        //     });
        this.prompt.openModal();
    }

    open(session: SessionModel): void {
        this.sessionController.restoreSession(session.id);
    }

    toDateString(session: SessionModel) {
        return new Date(session.date.toString()).toLocaleString();
    }

    getStats(session: SessionModel) {
        return `${session.windows.length} Windows  ${countTabs(session)} Tabs`
    }

}
