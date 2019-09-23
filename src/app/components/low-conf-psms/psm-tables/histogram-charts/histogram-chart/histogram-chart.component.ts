import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {noUndefined} from "@angular/compiler/src/util";
import {HistgramBin} from "../../../../../model/histogram-bin";
import {EChartOption} from 'echarts';

@Component({
    selector: 'app-histogram-chart',
    templateUrl: './histogram-chart.component.html',
    styleUrls: ['./histogram-chart.component.scss']
})
export class HistogramChartComponent implements OnChanges{

    histData: any[];
    oneBarStart: number;
    oneBarEnd: number;
    chartOption: any;
    myCharts: any;
    rankIndex: number;
    itemIndex: any;
    distance: number;
    interval: number;
    oldRankIndex: number;
    @Input() isSortField: boolean;
    @Input() activedPageValues: Array<number>;
    @Input() activedPsm: {rank: number, value: number};
    @Input() activedPsmIndex: number;
    @Input() activedBinRange: Array<{rank: number, value: number}>;
    @Input() histBins:HistgramBin[];
    @Input() dataName:number;
    @Input() page: any;
    @Input() sortType: any;
    onChartInit (ec: any) {
        this.myCharts = ec
    }
    constructor() {
        // Object.assign(this, {single})
        this.rankIndex = 0
        this.itemIndex = 0
        this.distance = 0
        this.interval = 1
        this.oneBarStart = 0
        this.oneBarEnd = 0
        this.histData= [
            {
                "name": "error",
                "value": 1
            }
        ];
        this.chartOption = {
            title: {
                text: '',
                textAlign: 'left',
                x:'center',
                y:'3%'
            },
            xAxis: {
                name: '',
                type: 'category',
                data: [],
                align: 'middle',
                axisLabel: {  
                    interval:0,  
                    rotate:90  
                }
            },
            grid: {
                containLabel: true,
                height: '80%',
            },
            yAxis: {
                name: '',
                type: 'value',
                min: 0,
                max: 0
            },
            // 由于用到了stack色块动画会很怪关闭了动画
            animation: false,
            // echarts4.2.1最新版本有bug issue已经有人提了后续可能会改更新版本以后可以用
            dataZoom: [
                {
                    id: `${Math.random() * 10}`,
                    type: 'slider',
                    yAxisIndex: 0,
                    filterMode: 'filter',
                    width: 20,
                    // handleSize: 8,
                    showDataShadow: false,
                    left: '94%',
                    show: true
                }
            ],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: (params) => {
                    let total = 0
                    params.forEach((item) => {
                        total += item.value
                    })
                    return `Number: ${total}`
                }
            },
            series: [
                {
                    data: [],
                    type: 'bar',
                    stack: 'one',
                    name: 'one',
                    itemStyle: {
                        color: '#4cabce',
                        stroke: '#4cabce'
                    }
                    // renderItem: this.renderItem.bind(this),
                },
                {
                    type: 'bar',
                    stack: 'one',
                    name: 'one',
                    data: [],
                    itemStyle: {
                        color: 'rgb(144, 223, 255)',
                        stroke: 'rgb(144, 223, 255)'
                    }
                },
                {
                    data: [],
                    type: 'bar',
                    stack: 'one',
                    name: 'one',
                    itemStyle: {
                        color: '#003366',
                        stroke: '#003366'
                    }
                },
                {
                    type: 'bar',
                    stack: 'one',
                    name: 'one',
                    data: [],
                    itemStyle: {
                        color: 'rgb(144, 223, 255)',
                        stroke: 'rgb(144, 223, 255)'
                    }
                },
                {
                    type: 'bar',
                    stack: 'one',
                    name: 'one',
                    data: [],
                    itemStyle: {
                        color: '#4cabce',
                        stroke: '#4cabce'
                    }
                }
            ]
        };
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
    psmSortDirection = 'asc';

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
           this.activedBinRange == null || this.activedBinRange.length<1 || this.activedBinRange[0].rank < 0 || this.activedBinRange[1].rank < 0){
            return ;
        }
        this.showHis = true;
        this.chartOption.series[0].data = this.histBins
        this.chartOption.yAxis.max = Math.max.apply(Math, this.histBins.map(function(o) {return o.value}))
        this.chartOption.title.text = this.dataName
        this.chartOption.xAxis.data = this.histBins.map((item) => {
            return item.name
        })
        this.chartOption.series[0].data = this.histBins.map((item) => {
            return {
                value: item.value,
                itemStyle: {
                    color: '#4cabce'
                }
            }
        })
        this.chartOption.series[1].data = this.histBins.map(() => {
            return 0
        })
        this.chartOption.series[2].data = this.histBins.map(() => {
            return 0
        })
        this.chartOption.series[3].data = this.histBins.map(() => {
            return 0
        })
        this.chartOption.series[4].data = this.histBins.map(() => {
            return 0
        })
        // 升序整合页面value数据
        this.activedPageValues = this.activedPageValues.sort((a, b):any => {
            return a - b
        })
        let r0 = this.activedBinRange[0].value < this.activedBinRange[1].value ? this.activedBinRange[0] : this.activedBinRange[1],
            r1 = this.activedBinRange[0].value > this.activedBinRange[1].value ? this.activedBinRange[0] : this.activedBinRange[1],
            lowRank = r0.rank,
            highRank = r1.rank;
        let r0ValueFixed = r0.value.toFixed(3),
            r1ValueFixed = r1.value.toFixed(3),
            activeBin = this.histBins[this.activedPsm.rank - 1]
        if(!activeBin){
            return;
        }
        if (this.isSortField === false) {
            let binUpper = activeBin.upperBound,
                binLower = activeBin.lowerBound,
                aver = (binUpper - binLower) / activeBin.value,
                initPos = Math.floor((this.activedPsm.value - binLower) / aver)
            initPos = initPos - 1 <= 0 ? 0 : initPos - 1;
            if(binLower == binUpper) {
                initPos =  Math.floor(0.5 * activeBin.value);
            }
            if (initPos > activeBin.value) {
                initPos = activeBin.value - 1
            }
            this.chartOption.series[0].data[activeBin.rank - 1] = initPos
            this.chartOption.series[2].data[activeBin.rank - 1] = 1
            this.chartOption.series[4].data[activeBin.rank - 1] = (activeBin.value - initPos - 1) < 0 ? 0 : activeBin.value - initPos - 1
        }  else {
            if (this.sortType === 'desc') {
                let prev = 0, end = 0;          //Firstly, set all coverage bar to blue color
                // let sumOfValue = 0;
                if (!this.histBins[lowRank - 1] || !this.histBins[highRank - 1]) return
                for(let i = 0;i < 10;i++) {
                    if(this.activedPageValues[i] <= this.histBins[lowRank - 1].upperBound) end++;
                    if(this.activedPageValues[i] >= this.histBins[highRank - 1].lowerBound) prev++;
                }
                if (lowRank === highRank) {
                    let binUpper = activeBin.upperBound,
                        binLower = activeBin.lowerBound,
                        aver = (binUpper - binLower) / activeBin.value,
                        initPos = Math.floor((r0.value - binLower) / aver);

                    //if overflow, then up to Upper
                    if(initPos + 10 > activeBin.value)
                        initPos = activeBin.value - 9;
                    if(initPos < 1)
                        initPos = 1;
                        if(binLower == binUpper) {
                            initPos =  0
                            this.chartOption.series[0].data[lowRank - 1] = 0
                            this.chartOption.series[1].data[lowRank - 1] = this.activedPsmIndex
                            this.chartOption.series[2].data[lowRank - 1] = 1
                            this.chartOption.series[3].data[lowRank - 1] = activeBin.value - this.activedPsmIndex - 1
                            this.chartOption.series[4].data[lowRank - 1] = 0
                        } else {
                            this.chartOption.series[0].data[lowRank - 1] = activeBin.value - initPos - 9
                            this.chartOption.series[1].data[lowRank - 1] = this.activedPsmIndex - 1
                            this.chartOption.series[2].data[lowRank - 1] = 1
                            this.chartOption.series[3].data[lowRank - 1] = 10 - this.activedPsmIndex
                            this.chartOption.series[4].data[lowRank - 1] = initPos - 1
                        }
                } else {
                    for(let i = lowRank;i <= highRank;i++) {
                        if (i == highRank) {
                            if(this.activedPsm.rank === i){
                                this.chartOption.series[0].data[i - 1] = this.histBins[i - 1].value - prev
                                this.chartOption.series[1].data[i - 1] = this.activedPsmIndex - 1
                                this.chartOption.series[2].data[i - 1] = 1
                                this.chartOption.series[3].data[i - 1] = prev - this.activedPsmIndex 
                                this.chartOption.series[4].data[i - 1] = 0
                            } else {
                                this.chartOption.series[0].data[i - 1] = this.histBins[i - 1].value - prev
                                this.chartOption.series[1].data[i - 1] = prev
                                this.chartOption.series[2].data[i - 1] = 0
                                this.chartOption.series[3].data[i - 1] = 0 
                                this.chartOption.series[4].data[i - 1] = 0 
                            }
                            continue;
                        }
                        if (i == lowRank) {
                            if (this.activedPsm.rank === i) {
                                let nowIndex = 0
                                for (let j = this.activedBinRange[0].rank - 1; j > i; j--) {
                                    nowIndex += this.histBins[j -1].value
                                }
                                nowIndex = nowIndex + prev
                                let rest = this.activedPsmIndex - nowIndex
                                this.chartOption.series[0].data[i - 1] = this.histBins[i - 1].value - end
                                this.chartOption.series[1].data[i - 1] = rest - 1
                                this.chartOption.series[2].data[i - 1] = 1
                                this.chartOption.series[3].data[i - 1] = end - rest
                                this.chartOption.series[4].data[i - 1] = 0
                            } else {
                                this.chartOption.series[0].data[i - 1] = this.histBins[i - 1].value - end
                                this.chartOption.series[1].data[i - 1] = end
                                this.chartOption.series[2].data[i - 1] = 0
                                this.chartOption.series[3].data[i - 1] = 0
                                this.chartOption.series[4].data[i - 1] = 0
                            }
                            continue;
                        }
                        if (lowRank < i && i < highRank) {
                            if (this.activedPsm.rank === i) {
                                let nowIndex = 0
                                for (let j = this.activedBinRange[0].rank - 1; j > i; j--) {
                                    nowIndex += this.histBins[j -1].value
                                }
                                nowIndex = nowIndex + prev
                                let rest = this.activedPsmIndex - nowIndex
                                this.chartOption.series[0].data[i - 1] = 0
                                this.chartOption.series[1].data[i - 1] = rest - 1
                                this.chartOption.series[2].data[i - 1] = 1
                                this.chartOption.series[3].data[i - 1] = this.histBins[i - 1].value - rest
                                this.chartOption.series[4].data[i - 1] = 0
                            } else {
                                this.chartOption.series[0].data[i - 1] = 0
                                this.chartOption.series[1].data[i - 1] = 0
                                this.chartOption.series[2].data[i - 1] = 0
                                this.chartOption.series[3].data[i - 1] = this.histBins[i - 1].value
                                this.chartOption.series[4].data[i - 1] = 0
                            }
                        }
                    }
                }
            } else {
                let prev = 0, end = 0;          //Firstly, set all coverage bar to blue color
                // you BUG
                if (!this.histBins[lowRank - 1] || !this.histBins[highRank - 1]) return
                for(let i = 0;i < 10;i++) {
                    if(this.activedPageValues[i] <= this.histBins[lowRank - 1].upperBound) prev++;
                    if(this.activedPageValues[i] >= this.histBins[highRank - 1].lowerBound) end++;
                }
                if (lowRank === highRank) {
                    let binUpper = activeBin.upperBound,
                        binLower = activeBin.lowerBound,
                        aver = (binUpper - binLower) / activeBin.value,
                        initPos = Math.floor((r0.value - binLower) / aver);
                    //if overflow, then up to Upper
                    if(initPos + 10 > activeBin.value)
                        initPos = activeBin.value - 9;
                    if(initPos < 1)
                        initPos = 1;
                    if(binLower == binUpper) {
                        initPos =  0
                        this.chartOption.series[0].data[lowRank - 1] = 0
                        this.chartOption.series[1].data[lowRank - 1] = this.activedPsmIndex
                        this.chartOption.series[2].data[lowRank - 1] = 1
                        this.chartOption.series[3].data[lowRank - 1] = activeBin.value - this.activedPsmIndex - 1
                        this.chartOption.series[4].data[lowRank - 1] = 0
                    } else {
                        this.chartOption.series[0].data[lowRank - 1] = activeBin.value - initPos - 9
                        this.chartOption.series[1].data[lowRank - 1] = this.activedPsmIndex - 1
                        this.chartOption.series[2].data[lowRank - 1] = 1
                        this.chartOption.series[3].data[lowRank - 1] = 10 - this.activedPsmIndex
                        this.chartOption.series[4].data[lowRank - 1] = initPos - 1
                    }
                } else {
                    for(let i = lowRank; i <= highRank; i++) {
                        if (i == lowRank) {
                            if(this.activedPsm.rank === i){
                                this.chartOption.series[0].data[i - 1] = this.histBins[i - 1].value - prev
                                this.chartOption.series[1].data[i - 1] = this.activedPsmIndex - 1
                                this.chartOption.series[2].data[i - 1] = 1
                                this.chartOption.series[3].data[i - 1] = prev - this.activedPsmIndex 
                                this.chartOption.series[4].data[i - 1] = 0
                            } else {
                                this.chartOption.series[0].data[i - 1] = this.histBins[i - 1].value - prev
                                this.chartOption.series[1].data[i - 1] = prev
                                this.chartOption.series[2].data[i - 1] = 0
                                this.chartOption.series[3].data[i - 1] = 0 
                                this.chartOption.series[4].data[i - 1] = 0 
                            }
                            continue;
                        }
                        if (i == highRank) {
                            if (this.activedPsm.rank === i) {
                                let nowIndex = 0
                                for (let j = this.activedBinRange[0].rank + 1; j < i; j++) {
                                    nowIndex += this.histBins[j -1].value
                                }
                                nowIndex = nowIndex + prev
                                let rest = this.activedPsmIndex - nowIndex
                                this.chartOption.series[0].data[i - 1] = this.histBins[i - 1].value - end
                                this.chartOption.series[1].data[i - 1] = rest - 1
                                this.chartOption.series[2].data[i - 1] = 1
                                this.chartOption.series[3].data[i - 1] = end - rest
                                this.chartOption.series[4].data[i - 1] = 0
                            } else {
                               this.chartOption.series[0].data[i - 1] = this.histBins[i - 1].value - end
                                this.chartOption.series[1].data[i - 1] = end
                                this.chartOption.series[2].data[i - 1] = 0
                                this.chartOption.series[3].data[i - 1] = 0
                                this.chartOption.series[4].data[i - 1] = 0
                            }
                            continue;
                        }
                        if (lowRank < i && i < highRank) {
                            if (this.activedPsm.rank === i) {
                                let nowIndex = 0
                                for (let j = this.activedBinRange[0].rank + 1; j < i; j++) {
                                    nowIndex += this.histBins[j -1].value
                                }
                                nowIndex = nowIndex + prev
                                let rest = this.activedPsmIndex - nowIndex
                                console.log(nowIndex, rest)
                                this.chartOption.series[0].data[i - 1] = 0
                                this.chartOption.series[1].data[i - 1] = rest - 1
                                this.chartOption.series[2].data[i - 1] = 1
                                this.chartOption.series[3].data[i - 1] = this.histBins[i - 1].value - rest
                                this.chartOption.series[4].data[i - 1] = 0
                            } else {
                                this.chartOption.series[0].data[i - 1] = 0
                                this.chartOption.series[1].data[i - 1] = 0
                                this.chartOption.series[2].data[i - 1] = 0
                                this.chartOption.series[3].data[i - 1] = this.histBins[i - 1].value
                                this.chartOption.series[4].data[i - 1] = 0
                            }
                        }
                    }
                }
            }
        }
        if (this.myCharts) {
            this.myCharts.setOption(this.chartOption)
        }
        this.oldRankIndex = this.rankIndex
//         if (this.activedPsm.rank >=0 && this.activedBinRange[0].rank >= 0 && this.activedBinRange[1].rank >= 0 && this.histBins != null) {

//             //get the histgram data, for color them next step
//             this.histBinsResolved = this.histBins.map((bin, index) => {
//                 return {
//                     "name": bin.name,
//                     "series": [
//                         {
//                             "name": bin.name,
//                             "value": bin.value
//                         }
//                     ]
//                 }
//             })

// /*
//             for(let i=0; i<this.histBinsResolved.length; i++){
//                 let histBin = this.histBinsResolved[i];
//                 for (let j=0; j<histBin.series.length; j++){
//                     console.log(histBin.series[j]);
//                     if(histBin.series[j].value == 0 ){
//                         this.histBinsResolved.splice(i, 1);
//                         continue;
//                     }
//                 }

//             }
// */
//             //get the sort direction before sorting
//             if(this.activedPageValues[this.activedPageValues.length - 1] < this.activedPageValues[0]) {
//                 this.psmSortDirection = 'desc';
//             }
//             // sort array
//             for(let i = 0;i < (this.activedPageValues.length - 1);i++) {
//                 let min = i;
//                 for(let j = i+1;j < this.activedPageValues.length;j++){
//                     if(this.activedPageValues[min] > this.activedPageValues[j]) min = j;
//                 }
//                 if(i != min) {
//                     let tmp                     = this.activedPageValues[i];
//                     this.activedPageValues[i]   = this.activedPageValues[min];
//                     this.activedPageValues[min] = tmp;
//                 }
//             }

//             //calcute customColors area
//             /*
//             let r0 = this.activedBinRange[0].value < this.activedBinRange[1].value ? this.activedBinRange[0] : this.activedBinRange[1],
//                 r1 = this.activedBinRange[0].value > this.activedBinRange[1].value ? this.activedBinRange[0] : this.activedBinRange[1],
//                 lowRank = r0.rank,
//                 highRank = r1.rank;
//             if(r0.value == null || r1.value == null) {
//                 return;
//             }

//             let r0ValueFixed = r0.value.toFixed(3),
//                 r1ValueFixed = r1.value.toFixed(3),
//                 activeBin = this.histBins[this.activedPsm.rank - 1],
//                 activeBinResolved = this.histBinsResolved[this.activedPsm.rank - 1],
//                 blueName = r0ValueFixed + " - " + r1ValueFixed;
//             if(activeBin.value == 0){
//                 return;
//             }

//             if(this.isSortField == false) {       //not sort field, only show one red line
//                 let binUpper = activeBin.upperBound,
//                     binLower = activeBin.lowerBound,
//                     aver = (binUpper - binLower) / activeBin.value,
//                     initPos = Math.floor((this.activedPsm.value - binLower) / aver),
//                     thisBin = this.histBinsResolved[activeBin.rank - 1];



//                 initPos = initPos - 1 <= 0 ? 0 : initPos - 1;

//                 //if the whole bin is from the same value, choose the middle to highlight
//                 if(binLower == binUpper) {
//                     initPos = 0.5 * activeBin.value;
//                 }

//                 thisBin.series = [
//                     {
//                         name: thisBin.name,
//                         value: initPos
//                     }, {
//                         name: this.activedPsm.value.toString(),
//                         value: 1
//                     }, {
//                         name: thisBin.name,
//                         value: activeBin.value - initPos - 1
//                     }
//                 ]
//             } else if(lowRank == highRank) {     //if in one section, divide into 1, 2, or 3 pieces
//                 // uncommon case: value <= 10, but still highlight
//                 if(activeBin.value <= 10) {
//                     activeBinResolved.series[0].name = blueName;
//                 }else {
//                     //common case: value > 10, assume average distribution
//                     let binUpper = activeBin.upperBound,
//                         binLower = activeBin.lowerBound,
//                         aver = (binUpper - binLower) / activeBin.value,
//                         initPos = Math.floor((r0.value - binLower) / aver);

//                     //if overflow, then up to Upper
//                     if(initPos + 10 > activeBin.value)
//                         initPos = activeBin.value - 9;
//                     if(initPos < 1)
//                         initPos = 1;
//                     // console.log("initPos + " + initPos + "activeBin.value " + activeBin.value);

//                     activeBinResolved.series = [
//                         {
//                             name: activeBinResolved.name,
//                             value: initPos - 1
//                         },{
//                             name: blueName,
//                             value: this.activedPsmIndex - 1
//                         },{
//                             name: this.activedPsm.value.toString(),
//                             value: 1
//                         },{
//                             name: blueName,
//                             value: 10 - this.activedPsmIndex
//                         },{
//                             name: activeBinResolved.name,
//                             value: activeBin.value - initPos - 9
//                         }
//                     ]
//                 }
//             }else {                             //if cover more than one section
//                 let prev = 0, end = 0;          //Firstly, set all coverage bar to blue color
//                 let sumOfValue = 0;
//                 for(let i = 0;i < 10;i++) {
//                     if(this.activedPageValues[i] <= this.histBins[lowRank - 1].upperBound) prev++;
//                         thisPsmIndex = this.activedPsmIndex
//                     if (this.psmSortDirection == 'desc'){
//                         thisPsmIndex = this.activedPageValues.length - (thisPsmIndex-1);
//                     }
//                     if(i == lowRank) {
//                         sumOfValue += prev;

//                         if(thisPsmIndex <= sumOfValue){
//                             thisBinResolved.series = [
//                                 {
//                                     name: thisBinName,
//                                     value: thisBin.value - prev
//                                 },{
//                                     name: blueName,
//                                     value: thisPsmIndex - 1
//                                 },{
//                                     name: this.activedPsm.value.toString(),
//                                     value: 1
//                                 },{
//                                     name: blueName,
//                                     value: prev - thisPsmIndex
//                                 }
//                             ]
//                         }else {
//                             thisBinResolved.series = [
//                                 {
//                                     name: thisBinName,
//                                     value: thisBin.value - prev
//                                 },{
//                                     name: blueName,
//                                     value: prev
//                                 }
//                             ]
//                         }
//                         continue;
//                     }

//                     if(i == highRank) {
//                         let rest = thisPsmIndex - sumOfValue;
//                         if(rest > 0 && rest <= end) {
//                             thisBinResolved.series = [
//                                 {
//                                     name: blueName,
//                                     value: rest - 1
//                                 },{
//                                     name: this.activedPsm.value.toString(),
//                                     value: 1
//                                 },{
//                                     name: blueName,
//                                     value: end - rest
//                                 },{
//                                     name: thisBinName,
//                                     value: thisBin.value - end
//                                 }
//                             ]
//                         }else {
//                             thisBinResolved.series = [
//                                 {
//                                     name: blueName,
//                                     value: end
//                                 },{
//                                     name: thisBinName,
//                                     value: thisBin.value - end
//                                 }
//                             ]
//                         }
//                         continue;
//                     }


//                     if(thisPsmIndex > sumOfValue && thisPsmIndex <= (sumOfValue + thisBin.value)) {
//                         let rest = thisPsmIndex - sumOfValue;
//                         thisBinResolved.series = [
//                             {
//                                 name: blueName,
//                                 value: rest - 1
//                             },{
//                                 name: this.activedPsm.value.toString(),
//                                 value: 1
//                             },{
//                                 name: blueName,
//                                 value: thisBin.value - rest
//                             }
//                         ]
//                     }else {
//                         thisBinResolved.series = [
//                             {
//                                 name: blueName,
//                                 value: thisBin.value
//                             }
//                         ]
//                     }

//                     sumOfValue += thisBin.value;
//                 }
//             }*/

//             this.customColors = [
//                 // {
//                 //     name: blueName,      //coverage of current page
//                 //     value: "lightblue"
//                 // },{
//                 //     name: this.activedPsm.value.toString(),     //selected psm
//                 //     value: "red"
//                 // }
//             ]
//         }
//         this.histData = this.histBins;             if(this.activedPageValues[i] >= this.histBins[highRank - 1].lowerBound) end++;
//                 }




//                 for(let i = lowRank;i <= highRank;i++) {
//                     let thisBin = this.histBins[i - 1],
//                         thisBinResolved = this.histBinsResolved[i - 1],
//                         thisBinName = thisBinResolved.name,
//                         thisPsmIndex = this.activedPsmIndex
//                     if (this.psmSortDirection == 'desc'){
//                         thisPsmIndex = this.activedPageValues.length - (thisPsmIndex-1);
//                     }
//                     if(i == lowRank) {
//                         sumOfValue += prev;

//                         if(thisPsmIndex <= sumOfValue){
//                             thisBinResolved.series = [
//                                 {
//                                     name: thisBinName,
//                                     value: thisBin.value - prev
//                                 },{
//                                     name: blueName,
//                                     value: thisPsmIndex - 1
//                                 },{
//                                     name: this.activedPsm.value.toString(),
//                                     value: 1
//                                 },{
//                                     name: blueName,
//                                     value: prev - thisPsmIndex
//                                 }
//                             ]
//                         }else {
//                             thisBinResolved.series = [
//                                 {
//                                     name: thisBinName,
//                                     value: thisBin.value - prev
//                                 },{
//                                     name: blueName,
//                                     value: prev
//                                 }
//                             ]
//                         }
//                         continue;
//                     }

//                     if(i == highRank) {
//                         let rest = thisPsmIndex - sumOfValue;
//                         if(rest > 0 && rest <= end) {
//                             thisBinResolved.series = [
//                                 {
//                                     name: blueName,
//                                     value: rest - 1
//                                 },{
//                                     name: this.activedPsm.value.toString(),
//                                     value: 1
//                                 },{
//                                     name: blueName,
//                                     value: end - rest
//                                 },{
//                                     name: thisBinName,
//                                     value: thisBin.value - end
//                                 }
//                             ]
//                         }else {
//                             thisBinResolved.series = [
//                                 {
//                                     name: blueName,
//                                     value: end
//                                 },{
//                                     name: thisBinName,
//                                     value: thisBin.value - end
//                                 }
//                             ]
//                         }
//                         continue;
//                     }


//                     if(thisPsmIndex > sumOfValue && thisPsmIndex <= (sumOfValue + thisBin.value)) {
//                         let rest = thisPsmIndex - sumOfValue;
//                         thisBinResolved.series = [
//                             {
//                                 name: blueName,
//                                 value: rest - 1
//                             },{
//                                 name: this.activedPsm.value.toString(),
//                                 value: 1
//                             },{
//                                 name: blueName,
//                                 value: thisBin.value - rest
//                             }
//                         ]
//                     }else {
//                         thisBinResolved.series = [
//                             {
//                                 name: blueName,
//                                 value: thisBin.value
//                             }
//                         ]
//                     }

//                     sumOfValue += thisBin.value;
//                 }
//             }*/

//             this.customColors = [
//                 // {
//                 //     name: blueName,      //coverage of current page
//                 //     value: "lightblue"
//                 // },{
//                 //     name: this.activedPsm.value.toString(),     //selected psm
//                 //     value: "red"
//                 // }
//             ]
//         }
//         this.histData = this.histBins;
    }

    getSplitedPrevValue(lower: number, uppper: number, value: number, target: number): number{
        let aver = (uppper - lower) / value,
            prev = (target - lower) / aver;
        return Math.floor(prev);
    }
}

