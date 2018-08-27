import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {AnalysisJob} from "../model/analysisJob";

@Injectable()
export class AnalysisDataService{

    analysisJobSource = new BehaviorSubject(null);
    analysisTokenSource = new BehaviorSubject("");
    analysisEnabledSource = new BehaviorSubject(true);
    fileUploadEnabledSource = new BehaviorSubject(true);
    currentAnalysisJob = this.analysisJobSource.asObservable();
    currentAnalysisToken = this.analysisTokenSource.asObservable();
    currentAnalysisEnabled = this.analysisEnabledSource.asObservable();
    currentFileUploadEnabled = this.fileUploadEnabledSource.asObservable();

    constructor() { }

    changeAnalysisJob(analysisJob: AnalysisJob) {
        this.analysisJobSource.next(analysisJob);
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
