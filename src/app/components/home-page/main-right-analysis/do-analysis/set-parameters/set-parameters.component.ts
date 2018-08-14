import {Component, Input, OnInit} from '@angular/core';
import {Config} from "../../../../../model/config";
import {DoAnalysisService} from "../../../../../services/do-analysis.service";
import {AnalysisDataService} from "../../../../../services/analysis-data.service";

@Component({
    selector: 'app-set-parameters',
    templateUrl: './set-parameters.component.html',
    styleUrls: ['./set-parameters.component.scss']
})
export class SetParametersComponent implements OnInit {
    analysisJobId:number;
    public minClusterSize:number = Config.defaultMinClusterSize;
    constructor(private  doAnalysisService: DoAnalysisService, private analysisData:AnalysisDataService) {
    }

    ngOnInit() {
        this.analysisData.currentAnalysisId.subscribe(analysisId => this.analysisJobId = analysisId);
    }

    doAnalysis() {
        if(this.analysisJobId <= 0){
            alert("Please upload your files firstly");
            return;
        }
        alert("Start to analysis job" +this.analysisJobId+ "with cluster Size "+ this.minClusterSize)
        this.doAnalysisService.do_analysis(this.analysisJobId, this.minClusterSize);
    }

    onChange(event) {
        this.minClusterSize = event;
    }
}
