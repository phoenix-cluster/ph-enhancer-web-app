import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AnalysisDataService{

    analysisIdSource = new BehaviorSubject(0);
    analysisTokenSource = new BehaviorSubject("");
    analysisEnabledSource = new BehaviorSubject(true);
    fileUploadEnabledSource = new BehaviorSubject(true);
    currentAnalysisId = this.analysisIdSource.asObservable();
    currentAnalysisToken = this.analysisTokenSource.asObservable();
    currentAnalysisEnabled = this.analysisEnabledSource.asObservable();
    currentFileUploadEnabled = this.fileUploadEnabledSource.asObservable();

    constructor() { }

    changeAnalysisId(analysisId: number) {
        this.analysisIdSource.next(analysisId);
    }
    changeAnalysisToken(analysisToken: string) {
        this.analysisTokenSource.next(analysisToken);
    }
    changeAnalysisEnabled(analysisEnabled: boolean) {
        this.analysisEnabledSource.next(analysisEnabled);
    }
    changeFileUploadEnabled(fileUploadEnabled: boolean) {
        this.fileUploadEnabledSource.next(fileUploadEnabled);
    }
}
