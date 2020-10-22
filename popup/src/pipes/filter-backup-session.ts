import { Pipe, PipeTransform } from '@angular/core';
import { SessionModel } from 'src/types/session';

@Pipe({
    name: 'filterBackupSessions',
    pure: true
})
export class FilterBackupSessionsPipe implements PipeTransform {

    constructor() { }

    transform(value: SessionModel[]): SessionModel[] {
        return value.filter(s => s.type === "Backup");
    }

}
