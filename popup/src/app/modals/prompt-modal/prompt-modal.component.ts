import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscriber } from 'rxjs';

export interface PromptModal {
    title: string;
    answer: string;
    defaultAnswer: string;
    question: string;
}

@Component({
    selector: 'prompt-modal',
    templateUrl: './prompt-modal.component.html',
    styleUrls: ['./prompt-modal.component.scss']
})
export class PromptModalComponent implements OnInit, OnDestroy {
    modalRef: BsModalRef;
    @ViewChild("template", { static: true }) template;

    title: string;
    question: string;
    defaultAnswer: string;
    answer: string;

    subscription: Subscriber<string>;

    constructor(private modalService: BsModalService) {
    }

    ngOnInit(): void {
    }

    openModal(options: Partial<PromptModal>): Observable<string> {
        return new Observable((sub) => {
            this.subscription = sub;

            this.title = options.title;
            this.defaultAnswer = options.defaultAnswer;
            this.answer = options.answer;
            this.question = options.question;

            this.modalRef = this.modalService.show(this.template, {
                class: 'modal-sm',
                ignoreBackdropClick: true,
                keyboard: true,
                focus: false
            });
        });
    }

    save() {
        this.modalRef.hide();
        this.subscription.next((this.answer || "").trim() || this.defaultAnswer);
    }

    cancel() {
        this.modalRef.hide();
        this.subscription.unsubscribe();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
