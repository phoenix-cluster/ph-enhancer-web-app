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
    @Input() activedPage: Array<number>;
    @Input() activedPsm: {rank: number, value: number};
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

            //calcute customColors area
            let r0 = this.activedBinRange[0].value < this.activedBinRange[1].value ? this.activedBinRange[0] : this.activedBinRange[1],
                r1 = this.activedBinRange[0].value > this.activedBinRange[1].value ? this.activedBinRange[0] : this.activedBinRange[1],
                lowRank = r0.rank,
                highRank = r1.rank,
                r0ValueFixed = r0.value.toFixed(3),
                r1ValueFixed = r1.value.toFixed(3),
                activeBin = this.histBins[this.activedPsm.rank - 1],
                activeBinResolved = this.histBinsResolved[this.activedPsm.rank - 1],
                blueName = r0ValueFixed + " - " + r1ValueFixed;

            if(this.isSortField == false) {       //not sort field, only show one line
                let binUpper = activeBin.upperBound,
                    binLower = activeBin.lowerBound,
                    aver = (binUpper - binLower) / activeBin.value,
                    initPos = Math.floor((this.activedPsm.value - binLower) / aver),
                    activeHistBinsResolved = this.histBinsResolved[activeBin.rank - 1];
                
                initPos = initPos-1 <= 0 ? 0 : initPos - 1
                activeHistBinsResolved.series = [
                    {
                        name: activeHistBinsResolved.name,
                        value: initPos
                    },{
                        name: this.activedPsm.value.toString(),
                        value: 1
                    },{
                        name: activeHistBinsResolved.name,
                        value: activeBin.value - initPos - 1
                    }
                ]
                // console.log(activeHistBinsResolved);
            }else if(lowRank == highRank) {     //if in one section, divide into 1, 2, or 3 pieces
                // uncommon case: value <= 10, but still highlight
                if(activeBin.value <= 10) {
                    activeBinResolved.series[0].name = r0.value + " - " + r1.value;
                }else {
                    //common case: value > 10, assume average distribution
                    let binUpper = activeBin.upperBound,
                        binLower = activeBin.lowerBound,
                        aver = (binUpper - binLower) / activeBin.value,
                        initPos = Math.floor((r0.value - binLower) / aver),
                        span = Math.floor((this.activedPsm.value - r0.value) / aver);
                    // console.log(binUpper + " " + binLower + "  " + aver + " " + initPos);

                    //if overflow, then up to Upper
                    if(initPos + 10 > activeBinResolved.value) initPos = activeBinResolved.value - 10;
                    // console.log("initPos + " + initPos + "activeBin.value " + activeBin.value);

                    activeBinResolved.series = [
                        {
                            name: activeBinResolved.name,
                            value: initPos - 1
                        },{
                            name: blueName,
                            value: span
                        },{
                            name: this.activedPsm.value.toString(),
                            value: 1
                        },{
                            name: blueName,
                            value: 9 - span
                        },{
                            name: activeBinResolved.name,
                            value: activeBin.value - initPos - 9
                        }
                    ]

                }
            }else {                             //if cover more than one section
                let sumOfMidCover = 0           //highlight middle section
                for(let i = lowRank+1;i < highRank;i++) {
                    sumOfMidCover += this.histBins[i - 1].value
                    this.histBinsResolved[i - 1].series[0].name = blueName;

                    if(this.activedPsm.rank == i) {
                        let splitedPrevValue = this.getSplitedPrevValue(this.histBins[i-1].lowerBound, this.histBins[i-1].upperBound, this.histBins[i-1].value, this.activedPsm.value);

                        this.histBinsResolved[i - 1].series = [
                            {
                                name: blueName,
                                value: splitedPrevValue
                            },{
                                name: this.activedPsm.value.toString(),
                                value: 1
                            },{
                                name: blueName,
                                value: this.histBins[i - 1].value - splitedPrevValue - 1
                            }
                        ]
                    }
                }

                //start or end of coverage range
                let prev = 0, end = 0;
                for(let i = 0;i < 10;i++) {
                    if(this.activedPage[i] <= this.histBins[lowRank - 1].upperBound) prev++;
                    if(this.activedPage[i] >= this.histBins[highRank - 1].lowerBound) end++;
                }
                console.log(this.activedPage);
                console.log(this.histBins);
                // console.log(prev + " " + end + "  "+ this.activedBinRank);
                // console.log(this.activedBinRank);
                // console.log(lowRank + " " + highRank);
                if(this.activedPsm.rank != lowRank) {           //selected psm not in this bin
                    this.histBinsResolved[lowRank - 1].series = [
                        {
                            name: this.histBinsResolved[lowRank - 1].name,
                            value: this.histBins[lowRank - 1].value - prev
                        },{
                            name: blueName,
                            value: prev
                        }
                    ]
                }else{                                              //selected psm in this bin
                    let lowBin = this.histBins[lowRank - 1],
                        aver = (lowBin.upperBound - lowBin.lowerBound) / lowBin.value,
                        initSpan = Math.floor((this.activedPsm.value - lowBin.lowerBound) / aver);
                    initSpan = initSpan-1 >= 0 ? initSpan-1 : 0;
                    console.log(this.activedPsm);
                    console.log("214: prev " + prev + "  initspan " + initSpan + " lowBin.value "+ lowBin.value);
                    this.histBinsResolved[lowRank - 1].series = [
                        {
                            name: lowBin.name,
                            value: lowBin.value - prev
                        },{
                            name: blueName,
                            value: initSpan
                        },{
                            name: this.activedPsm.value.toString(),
                            value: 1
                        },{
                            name: blueName,
                            value: prev - initSpan - 1
                        }
                    ]
                }

                let endValue = 10 - prev - sumOfMidCover;
                endValue = endValue < 0 ? 0 : endValue;
                if(this.activedPsm.rank != highRank) {
                    this.histBinsResolved[highRank - 1].series = [
                        {
                            name: blueName,
                            value: endValue
                        },{
                            name: this.histBinsResolved[highRank - 1].name,
                            value: this.histBins[highRank - 1].value - endValue
                        }
                    ]
                }else {
                    let highBin = this.histBins[highRank - 1],
                        aver = (highBin.upperBound - highBin.lowerBound) / highBin.value,
                        initSpan = Math.floor((this.activedPsm.value - highBin.lowerBound) / aver);
                    initSpan = initSpan-1 >= 0 ? initSpan-1 : 0;
                    console.log(aver + "  " + initSpan);
                    this.histBinsResolved[highRank - 1].series = [
                        {
                            name: blueName,
                            value: initSpan
                        },{
                            name: this.activedPsm.value.toString(),
                            value: 1
                        },{
                            name: blueName,
                            value: end - initSpan - 1
                        },{
                            name: this.histBinsResolved[highRank - 1].name,
                            value: this.histBins[highRank - 1].value - end
                        }
                    ]
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
