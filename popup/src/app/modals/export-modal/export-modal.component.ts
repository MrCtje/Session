import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscriber } from 'rxjs';

@Component({
  selector: 'export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.scss']
})
export class ExportModalComponent implements OnInit, OnDestroy{
    modalRef: BsModalRef;
    @ViewChild("template", { static: true }) template;

    exportText: string;
    subscription: Subscriber<void>;

    constructor(private modalService: BsModalService) {
    }

    ngOnInit(): void {
    }

    openModal(exportText: string): Observable<void> {
        return new Observable((sub) => {
            this.subscription = sub;
            this.exportText = exportText;

            this.modalRef = this.modalService.show(this.template, {
                class: 'modal-lg',
                ignoreBackdropClick: true,
                keyboard: true,
                focus: false
            });
        });
    }

    copyToClipboard(textArea) {
        textArea.select();
        document.execCommand("copy");
        this.close();
    }

    close() {
        this.modalRef.hide();
        this.subscription.unsubscribe();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
