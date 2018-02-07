import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {noUndefined} from "@angular/compiler/src/util";
import {HistgramBin} from "../../../../../model/histogram-bin";

@Component({
    selector: 'app-histogram-chart',
    templateUrl: './histogram-chart.component.html',
    styleUrls: ['./histogram-chart.component.scss']
})
export class HistogramChartComponent implements OnChanges{

    histData: any[];

    @Input() activedBinRank:number;
    @Input() histBins:HistgramBin[];
    @Input() dataName:string;

    constructor() {
        // Object.assign(this, {single})

        this.histData= [
            {
                "name": "error",
                "value": 1
            }
        ];
    }

    view: any[] = [400, 400];

    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = false;
    showXAxisLabel = true;
    xAxisLabel = this.dataName;
    showYAxisLabel = true;
    yAxisLabel = 'number';
    activeEntries: any[] = [];
    barPadding = 2;
    colorScheme = {
        domain: ['lightgray']
    };

    customColors = [];


    onSelect(event) {
        console.log(event);
    }

    onActivate(event): void {
        // let randomName = Math.floor(Math.random() * 10);
        // this.customColors = [
        //     {
        //         name: randomName.toString(),
        //         value: '#0000ff'
        //     }
        // ];
        // if(this.activeEntries.indexOf(event) > -1) return;
        // this.activeEntries = [{"name": "9", "value": 24}]
        // this.activeEntries = [ event, ...this.activeEntries ];
        // console.log(this.activeEntries);
        // this.activate.emit({ value: event, entries: this.activeEntries });
    }


    ngOnChanges(): void {
        if(this.histBins == null || this.histBins.length <1 || this.activedBinRank == null || this.activedBinRank <0){
            return ;
        }

        this.xAxisLabel = this.dataName;
        console.log(this.xAxisLabel);
        if (this.activedBinRank >=0 && this.histBins != null) {
            let binName = this.histBins[this.activedBinRank - 1].name;
            console.log(binName);
            if(binName) {
                this.customColors = [
                    {
                        name: binName.toString(),
                        value: 'lightblue'
                    }
                ];
            }
        }
        console.log(this.customColors);
        this.histData = this.histBins;
    }
}
