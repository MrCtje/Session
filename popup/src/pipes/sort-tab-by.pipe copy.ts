import { Pipe, PipeTransform } from '@angular/core';
import { TabModel } from 'src/types/tab';

@Pipe({
    name: 'sortTabBy',
    pure: true
})
export class SortTabByPipe implements PipeTransform {

    constructor() { }

    transform(value: TabModel[], attrib: keyof TabModel): TabModel[] {

        return value.sort((a, b) => {
            const aVal = a[attrib].toString().toLocaleLowerCase();
            const bVal = b[attrib].toString().toLocaleLowerCase()
            if (aVal > bVal) {
                return 1;
            } else if (aVal < bVal) {
                return -1;
            }
            return 0;
        });
    }

}
