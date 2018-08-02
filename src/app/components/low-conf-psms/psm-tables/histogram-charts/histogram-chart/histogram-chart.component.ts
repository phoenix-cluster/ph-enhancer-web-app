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

    @Input() isSortField: boolean;
    @Input() activedPageValues: Array<number>;
    @Input() activedPsm: {rank: number, value: number};
    @Input() activedPsmIndex: number;
    @Input() activedBinRange: Array<{rank: number, value: number}>;
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
    histBinsResolved: any[];
    showHis = false;

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
        // console.log(event);
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
        if(this.histBins == null || this.histBins.length <1 ||
           this.activedPsm == null || this.activedPsm.rank <0 ||
           this.activedBinRange == null || this.activedBinRange[0].rank < 0 || this.activedBinRange[1].rank < 0){
            return ;
        }
        this.showHis = true;
        this.xAxisLabel = this.dataName;
        // console.log(this.xAxisLabel);
        if (this.activedPsm.rank >=0 && this.activedBinRange[0].rank >= 0 && this.activedBinRange[1].rank >= 0 && this.histBins != null) {

            this.histBinsResolved = this.histBins.map((bin, index) => {
                return {
                    "name": bin.name,
                    "series": [
                        {
                            "name": bin.name,
                            "value": bin.value
                        }
                    ]
                }
            })
/*
            for(let i=0; i<this.histBinsResolved.length; i++){
                let histBin = this.histBinsResolved[i];
                for (let j=0; j<histBin.series.length; j++){
                    console.log(histBin.series[j]);
                    if(histBin.series[j].value == 0 ){
                        this.histBinsResolved.splice(i, 1);
                        continue;
                    }
                }

            }
*/

            // sort array
            for(let i = 0;i < (this.activedPageValues.length - 1);i++) {
                let min = i;
                for(let j = i+1;j < this.activedPageValues.length;j++){
                    if(this.activedPageValues[min] > this.activedPageValues[j]) min = j;
                }
                if(i != min) {
                    let tmp                     = this.activedPageValues[i];
                    this.activedPageValues[i]   = this.activedPageValues[min];
                    this.activedPageValues[min] = tmp;
                }
            }

            //calcute customColors area
            let r0 = this.activedBinRange[0].value < this.activedBinRange[1].value ? this.activedBinRange[0] : this.activedBinRange[1],
                r1 = this.activedBinRange[0].value > this.activedBinRange[1].value ? this.activedBinRange[0] : this.activedBinRange[1],
                lowRank = r0.rank,
                highRank = r1.rank;
            if(r0.value == null || r1.value == null) {
                return;
            }
            // console.log('activedPsm');
            // console.log(this.activedPsm);

            let r0ValueFixed = r0.value.toFixed(3),
                r1ValueFixed = r1.value.toFixed(3),
                activeBin = this.histBins[this.activedPsm.rank - 1],
                activeBinResolved = this.histBinsResolved[this.activedPsm.rank - 1],
                blueName = r0ValueFixed + " - " + r1ValueFixed;

            if(activeBin.value == 0){
                return;
            }
            // console.log(activeBin)
            // console.log(activeBinResolved)

            if(this.isSortField == false) {       //not sort field, only show one red line
                let binUpper = activeBin.upperBound,
                    binLower = activeBin.lowerBound,
                    aver = (binUpper - binLower) / activeBin.value,
                    initPos = Math.floor((this.activedPsm.value - binLower) / aver),
                    thisBin = this.histBinsResolved[activeBin.rank - 1];

                initPos = initPos-1 <= 0 ? 0 : initPos - 1;

                thisBin.series = [
                    {
                        name: thisBin.name,
                        value: initPos
                    },{
                        name: this.activedPsm.value.toString(),
                        value: 1
                    },{
                        name: thisBin.name,
                        value: activeBin.value - initPos - 1
                    }
                ]

            }else if(lowRank == highRank) {     //if in one section, divide into 1, 2, or 3 pieces
                // uncommon case: value <= 10, but still highlight
                if(activeBin.value <= 10) {
                    activeBinResolved.series[0].name = blueName;
                }else {
                    //common case: value > 10, assume average distribution
                    let binUpper = activeBin.upperBound,
                        binLower = activeBin.lowerBound,
                        aver = (binUpper - binLower) / activeBin.value,
                        initPos = Math.floor((r0.value - binLower) / aver);

                    //if overflow, then up to Upper
                    if(initPos + 10 > activeBin.value) 
                        initPos = activeBin.value - 9;
                    if(initPos < 1)
                        initPos = 1;
                    // console.log("initPos + " + initPos + "activeBin.value " + activeBin.value);

                    activeBinResolved.series = [
                        {
                            name: activeBinResolved.name,
                            value: initPos - 1
                        },{
                            name: blueName,
                            value: this.activedPsmIndex - 1
                        },{
                            name: this.activedPsm.value.toString(),
                            value: 1
                        },{
                            name: blueName,
                            value: 10 - this.activedPsmIndex
                        },{
                            name: activeBinResolved.name,
                            value: activeBin.value - initPos - 9
                        }
                    ]

                }
            }else {                             //if cover more than one section
                let prev = 0, end = 0;          //Firstly, set all coverage bar to blue color
                let sumOfValue = 0;
                for(let i = 0;i < 10;i++) {
                    if(this.activedPageValues[i] <= this.histBins[lowRank - 1].upperBound) prev++;
                    if(this.activedPageValues[i] >= this.histBins[highRank - 1].lowerBound) end++;
                }
                
                for(let i = lowRank;i <= highRank;i++) {
                    let thisBin = this.histBins[i - 1],
                        thisBinResolved = this.histBinsResolved[i - 1],
                        thisBinName = thisBinResolved.name,
                        thisPsmIndex = this.activedPsmIndex

                    if(i == lowRank) {
                        sumOfValue += prev;

                        if(thisPsmIndex <= sumOfValue){
                            thisBinResolved.series = [
                                {
                                    name: thisBinName,
                                    value: thisBin.value - prev
                                },{
                                    name: blueName,
                                    value: thisPsmIndex - 1
                                },{
                                    name: this.activedPsm.value.toString(),
                                    value: 1
                                },{
                                    name: blueName,
                                    value: prev - thisPsmIndex
                                }
                            ]
                        }else {
                            thisBinResolved.series = [
                                {
                                    name: thisBinName,
                                    value: thisBin.value - prev
                                },{
                                    name: blueName,
                                    value: prev
                                }
                            ]
                        }
                        continue;
                    }

                    if(i == highRank) {
                        let rest = thisPsmIndex - sumOfValue;
                        if(rest > 0 && rest <= end) {
                            thisBinResolved.series = [
                                {
                                    name: blueName,
                                    value: rest - 1
                                },{
                                    name: this.activedPsm.value.toString(),
                                    value: 1
                                },{
                                    name: blueName,
                                    value: end - rest
                                },{
                                    name: thisBinName,
                                    value: thisBin.value - end
                                }
                            ]
                        }else {
                            thisBinResolved.series = [
                                {
                                    name: blueName,
                                    value: end
                                },{
                                    name: thisBinName,
                                    value: thisBin.value - end
                                }
                            ]
                        }
                        continue;
                    }

                    
                    if(thisPsmIndex > sumOfValue && thisPsmIndex <= (sumOfValue + thisBin.value)) {
                        let rest = thisPsmIndex - sumOfValue;
                        thisBinResolved.series = [
                            {
                                name: blueName,
                                value: rest - 1
                            },{
                                name: this.activedPsm.value.toString(),
                                value: 1
                            },{
                                name: blueName,
                                value: thisBin.value - rest
                            }
                        ]
                    }else {
                        thisBinResolved.series = [
                            {
                                name: blueName,
                                value: thisBin.value
                            }
                        ]
                    }

                    sumOfValue += thisBin.value;
                }
            }

            this.customColors = [
                {
                    name: blueName,      //coverage of current page
                    value: "lightblue"
                },{
                    name: this.activedPsm.value.toString(),     //selected psm
                    value: "red"
                }
            ]
        }
        // console.log(this.customColors);
        this.histData = this.histBins;
    }

    getSplitedPrevValue(lower: number, uppper: number, value: number, target: number): number{
        let aver = (uppper - lower) / value,
            prev = (target - lower) / aver;
        return Math.floor(prev);
    }
}
