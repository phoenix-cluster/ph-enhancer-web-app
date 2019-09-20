import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class changedProjectId {
    id: string
}
export class CheckExamplesService {
    projectId: changedProjectId = {id: 'PXD000021'};
    idEventer: EventEmitter<changedProjectId> = new EventEmitter();
    constructor() { }

}
