import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
    name: 'safe'
})
export class SafePipe implements PipeTransform {

    constructor(private domSanitizer: DomSanitizer) { }

    transform(value: string): SafeUrl {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(value);
    }

}
