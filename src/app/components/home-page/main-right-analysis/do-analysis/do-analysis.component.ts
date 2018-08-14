import {Component, OnInit} from '@angular/core';
import {AnalysisDataService} from "../../../../services/analysis-data.service";
@Component({
    selector: 'app-do-analysis',
    templateUrl: './do-analysis.component.html',
    styleUrls: ['./do-analysis.component.scss']
})
export class DoAnalysisComponent implements OnInit {
    public analysisJobId: number ;

    constructor(private  analysisData:AnalysisDataService) {

    }

    ngOnInit() {
        this.analysisData.currentAnalysisId.subscribe(analysisId=>{this.analysisJobId = analysisId; console.log(this.analysisJobId)});
    }

}
