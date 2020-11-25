import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscriber } from 'rxjs';

@Component({
  selector: 'import-modal',
  templateUrl: './import-modal.component.html',
  styleUrls: ['./import-modal.component.scss']
})
export class ImportModalComponent implements OnInit, OnDestroy{
    modalRef: BsModalRef;
    @ViewChild("template", { static: true }) template;

    importText: string = "";
    importSubject: string;
    subscription: Subscriber<string>;

    constructor(private modalService: BsModalService) {
    }

    ngOnInit(): void {
    }

    openModal(importSubject: string): Observable<string> {
        return new Observable((sub) => {
            this.subscription = sub;
            this.importSubject = importSubject;

            this.modalRef = this.modalService.show(this.template, {
                class: 'modal-lg',
                ignoreBackdropClick: true,
                keyboard: true,
                focus: false
            });
        });
    }

    import() {
        this.modalRef.hide();
        this.subscription.next(this.importText);
    }

    close() {
        this.modalRef.hide();
        this.subscription.unsubscribe();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
