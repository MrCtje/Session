import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[requestFocus]'
})
export class RequestFocusDirective implements OnInit {
    @Input("requestFocus") delayFocus: number;

    constructor(private el: ElementRef<HTMLElement>) { }

    ngOnInit(): void {
        if (this.delayFocus) {
            setTimeout(() => this.el.nativeElement.focus(), this.delayFocus);
        } else {
            this.el.nativeElement.focus();
        }
    }

}
