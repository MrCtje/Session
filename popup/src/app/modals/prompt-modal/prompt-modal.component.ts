import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

export interface PromptModal {
    title: string;
    defaultAnswer: string;
    question: string;
}

@Component({
    selector: 'prompt-modal',
    templateUrl: './prompt-modal.component.html',
    styleUrls: ['./prompt-modal.component.scss']
})
export class PromptModalComponent implements OnInit {
    modalRef: BsModalRef;
    @ViewChild("template", {static: true}) template;

    title: string;
    question: string;
    defaultAnswer: string;
    answer: string = "";

    constructor(private modalService: BsModalService) {
    }

    openModal() {
        this.modalRef = this.modalService.show(this.template, { class: 'modal-sm' });
    }

    ngOnInit(): void {
    }

    save() {

    }

    cancel() { }

}
