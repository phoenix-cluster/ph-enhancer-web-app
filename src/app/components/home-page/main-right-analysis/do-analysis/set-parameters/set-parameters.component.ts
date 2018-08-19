import {Component, Input, OnInit} from '@angular/core';
import {Config} from "../../../../../model/config";
import {DoAnalysisService} from "../../../../../services/do-analysis.service";
import {AnalysisDataService} from "../../../../../services/analysis-data.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-set-parameters',
    templateUrl: './set-parameters.component.html',
    styleUrls: ['./set-parameters.component.scss']
})
export class SetParametersComponent implements OnInit {
    analysisJobId:number;
    analysisJobToken:string;
    analysisEnabled:boolean;
    public minClusterSize:number = Config.defaultMinClusterSize;

    constructor(private router: Router, private  doAnalysisService: DoAnalysisService, private analysisData:AnalysisDataService) {
    }

    ngOnInit() {
        this.analysisData.currentAnalysisId.subscribe(analysisId => this.analysisJobId = analysisId);
        this.analysisData.currentAnalysisToken.subscribe(analysisToken => this.analysisJobToken = analysisToken);
        this.analysisData.currentAnalysisEnabled.subscribe(analysisEnabled=> this.analysisEnabled = analysisEnabled);
    }

    doAnalysis() {
        if(this.analysisJobId <= 0){
            alert("Please upload your files firstly");
            return;
        }
        alert("Start to analysis job" +this.analysisJobId+ "with cluster Size "+ this.minClusterSize)
        this.doAnalysisService.do_analysis(this.analysisJobId, this.minClusterSize);
        this.analysisEnabled = false;
        this.analysisData.changeAnalysisEnabled(false);
    }

    onChange(event) {
        this.minClusterSize = event;
    }

    checkJobProgress(){
        if(this.analysisJobToken.length != 10){
            alert("The analysis job token is not char(10)");
            return;
        }

        this.router.navigateByUrl("job_progress/" + this.analysisJobToken).then(_ =>{console.log("route changed to job_progress")});
    }

}
