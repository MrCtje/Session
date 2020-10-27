import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

export interface MenuItem {
    label?: string;
    handler?: (additionalData?: any) => void;
    isDivider?: boolean;
}

@Component({
    selector: 'options-contextmenu',
    templateUrl: './options-contextmenu.component.html',
    styleUrls: ['./options-contextmenu.component.scss']
})
export class SettingsMenuComponent implements OnInit {
    @ViewChild("menuRef", { static: true }) _menuRef: ElementRef;
    @Input() menu: MenuItem[];
    @Output() menuRef: EventEmitter<ElementRef> = new EventEmitter();

    constructor() { }

    ngOnInit(): void {
        this.menuRef.emit(this._menuRef);
    }

}
