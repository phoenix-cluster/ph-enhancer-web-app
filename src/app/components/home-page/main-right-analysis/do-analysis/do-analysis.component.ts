import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-do-analysis',
    templateUrl: './do-analysis.component.html',
    styleUrls: ['./do-analysis.component.scss']
})
export class DoAnalysisComponent implements OnInit {
    public myAnalysisId: number = 0;

    constructor() {
    }

    ngOnInit() {
    }

    onNotify(message: number): void {
        this.myAnalysisId = message;
        alert(message);
    }
}
