import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

export interface MenuItem {
    label?: string;
    handler?: () => void;
    isDivider?: boolean;
}

@Component({
    selector: 'settings-menu',
    templateUrl: './settings-menu.component.html',
    styleUrls: ['./settings-menu.component.scss']
})
export class SettingsMenuComponent implements OnInit {
    @ViewChild("menu", { static: true }) menu: ElementRef;
    @Input() menuItems: MenuItem[];
    @Output() menuRef: EventEmitter<ElementRef> = new EventEmitter();

    constructor() { }

    ngOnInit(): void {
        this.menuRef.emit(this.menu);
    }

}
