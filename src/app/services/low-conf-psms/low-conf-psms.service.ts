import { Injectable } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subject} from 'rxjs/Subject';
@Injectable()
export class changedProjectId {
  id: string
}
export class LowConfPsmsService {
  public projectIdList: changedProjectId = {
      id: ''
  };
  private Source = new Subject<any>();
  public getChangedProjectId(projectId: string) {
    this.projectIdList.id = projectId
      this.Source.next(this.projectIdList.id)
  }
  constructor(private route: ActivatedRoute) { }
}
