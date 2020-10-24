import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[scrollToIfActive]'
})
export class ScrollToIfActiveDirective implements OnChanges {
    @Input("scrollToIfActive") isActive: boolean;

    constructor(private el: ElementRef<HTMLElement>) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.isActive.currentValue && !changes.isActive.firstChange) {
            this.scrollToElement();
        }
    }

    scrollToElement() {
        this.el.nativeElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}
