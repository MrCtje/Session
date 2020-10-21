import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { WindowModel } from 'src/types/window';

@Pipe({
    name: 'sortByIncognito'
})
export class SortByIncognitoPipe implements PipeTransform {

    constructor(private domSanitizer: DomSanitizer) { }

    transform(value: WindowModel[]): WindowModel[] {
        return value.sort((a,b) => Number(a.incognito) - Number(b.incognito));
    }

}
