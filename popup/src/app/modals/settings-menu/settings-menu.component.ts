import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscriber } from 'rxjs';

enum OptionType {
    Checkbox,
    Text,
    Number,
}

interface Option {
    label: string;
    type: OptionType;
    value: string | boolean | number;
}

interface Setting {
    category: string;
    options: Option[];
}

@Component({
    selector: 'settings-menu',
    templateUrl: './settings-menu.component.html',
    styleUrls: ['./settings-menu.component.scss']
})
export class SettingsMenuComponent implements OnInit {
    modalRef: BsModalRef;
    @ViewChild("template", { static: true }) template;

    subscription: Subscriber<string>;

    settings: Setting[] = [
        {
            category: "General",
            options: [
                {
                    label: "Record incognito windows",
                    type: OptionType.Checkbox,
                    value: true
                },
                {
                    label: "Enable backup sessions",
                    type: OptionType.Checkbox,
                    value: true
                },
                {
                    label: "Backup interval (minutes)",
                    type: OptionType.Number,
                    value: 3
                }, {
                    label: "Test boolean",
                    type: OptionType.Checkbox,
                    value: false
                }, {
                    label: "Test boolean",
                    type: OptionType.Checkbox,
                    value: false
                },
                {
                    label: "Test boolean",
                    type: OptionType.Text,
                    value: false
                }
            ]
        },
        {
            category: "Filter",
            options: [
                {
                    label: "Test boolean",
                    type: OptionType.Checkbox,
                    value: false
                },
                {
                    label: "Test boolean",
                    type: OptionType.Checkbox,
                    value: false
                }, {
                    label: "Test boolean",
                    type: OptionType.Checkbox,
                    value: false
                }, {
                    label: "Test boolean",
                    type: OptionType.Checkbox,
                    value: false
                },
            ]
        },
    ];

    get OptionType() {
        return OptionType;
    }

    constructor(private modalService: BsModalService) {
    }

    ngOnInit(): void {
    }

    openModal(): Observable<string> {
        return new Observable((sub) => {
            this.subscription = sub;

            this.modalRef = this.modalService.show(this.template, {
                class: 'modal-lg',
                ignoreBackdropClick: true,
                keyboard: true,
                focus: false
            });
        });
    }

    save() {
        this.modalRef.hide();
        this.subscription.next();
    }

    cancel() {
        this.modalRef.hide();
        this.subscription.unsubscribe();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
