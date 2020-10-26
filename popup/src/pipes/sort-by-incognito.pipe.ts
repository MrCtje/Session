import { Pipe, PipeTransform } from '@angular/core';
import { WindowModel } from 'src/types/window';

@Pipe({
    name: 'sortByIncognito',
    pure: true
})
export class SortByIncognitoPipe implements PipeTransform {

    constructor() { }

    transform(value: WindowModel[]): WindowModel[] {
        return value.sort((a,b) => Number(a.incognito) - Number(b.incognito));
    }

}
