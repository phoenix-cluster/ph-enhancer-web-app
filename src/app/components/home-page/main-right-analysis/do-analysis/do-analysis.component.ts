import {Component, OnInit} from '@angular/core';
import {AnalysisDataService} from "../../../../services/analysis-data.service";
import {AnalysisJob} from "../../../../model/analysisJob";
@Component({
    selector: 'app-do-analysis',
    templateUrl: './do-analysis.component.html',
    styleUrls: ['./do-analysis.component.scss']
})
export class DoAnalysisComponent implements OnInit {
    public analysisJobId: number ;
    public analysisJob: AnalysisJob;

    constructor(private  analysisData:AnalysisDataService) {

    }

    ngOnInit() {
        this.analysisData.currentAnalysisJob.subscribe(analysisJob => {
            this.analysisJob = analysisJob;
            if (this.analysisJob != null) this.analysisJobId = analysisJob.id;
        })
    }

}
