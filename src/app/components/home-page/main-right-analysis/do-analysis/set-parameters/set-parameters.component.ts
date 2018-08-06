import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-set-parameters',
    templateUrl: './set-parameters.component.html',
    styleUrls: ['./set-parameters.component.scss']
})
export class SetParametersComponent implements OnInit {
    @Input() myAnalysisId:number;
    public minClusterSize:number;
    constructor() {
    }

    ngOnInit() {
    }

    doAnalysis() {
        alert("Aye caption! let's do it " + this.minClusterSize)
    }

    onChange(event) {
        this.minClusterSize = event;
    }
}
