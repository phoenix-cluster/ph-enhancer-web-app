import {Component, Input, OnInit} from '@angular/core';
import {Config} from "../../../../../model/config";
import {DoAnalysisService} from "../../../../../services/do-analysis.service";

@Component({
    selector: 'app-set-parameters',
    templateUrl: './set-parameters.component.html',
    styleUrls: ['./set-parameters.component.scss']
})
export class SetParametersComponent implements OnInit {
    @Input() myAnalysisId:number;
    public minClusterSize:number = Config.defaultMinClusterSize;
    constructor(private  doAnalysisService: DoAnalysisService) {
    }

    ngOnInit() {
    }

    doAnalysis() {
        if(this.myAnalysisId <= 0){
            alert("Please upload your files firstly");
            return;
        }
        alert("Start to analysis job" +this.myAnalysisId + "with cluster Size "+ this.minClusterSize)
        this.doAnalysisService.do_analysis(this.myAnalysisId, this.minClusterSize);
    }

    onChange(event) {
        this.minClusterSize = event;
    }
}
