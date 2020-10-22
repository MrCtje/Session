import { Pipe, PipeTransform } from '@angular/core';
import { SessionModel } from 'src/types/session';

@Pipe({
    name: 'filterCurrentSession',
    pure: true
})
export class FilterCurrentSessionPipe implements PipeTransform {

    constructor() { }

    transform(value: SessionModel[]): SessionModel {
        return value.find(s => !Boolean(s.type as any));
    }

}
