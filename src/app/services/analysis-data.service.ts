import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AnalysisDataService{

    private analysisIdSource = new BehaviorSubject(0);
    currentAnalysisId = this.analysisIdSource.asObservable();

    constructor() { }

    changeAnalysisId(analysisId: number) {
        console.log(analysisId);
        this.analysisIdSource.next(analysisId);
    }
}
