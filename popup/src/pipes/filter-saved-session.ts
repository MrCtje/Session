import { Pipe, PipeTransform } from '@angular/core';
import { SessionModel } from 'src/types/session';

@Pipe({
    name: 'filterSavedSessions',
    pure: true
})
export class FilterSavedSessionsPipe implements PipeTransform {

    constructor() { }

    transform(value: SessionModel[]): SessionModel[] {
        return value.filter(s => s.type === "Saved");
    }

}
