import {Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {HistgramBin} from "../../../../model/histogram-bin";
import {Psm} from "../../../../model/psm";
import {Router} from "@angular/router";
import {StatisticsService} from "../../../../services/statistics.service";

class SimPsm {
  confidentScore: number;
  clusterRatio: number;
  clusterSize: number;
}

class RankAndValue {
    rank: number;
    value: number;

    constructor(rank: number, value: number) {
        this.rank = rank;
        this.value = value;
    }
}

@Component({
    selector: 'app-histogram-charts',
    templateUrl: './histogram-charts.component.html',
    styleUrls: ['./histogram-charts.component.scss']
})
export class HistogramChartsComponent implements OnChanges {
    @Input() activedPage: SimPsm[];
    @Input() activedPsm: Psm;
    @Input() activePsmIndex: number;
    @Input() page: number;
    @Input() sortType: any;
    @Input() sortField: string;
    @Input() psmType: string;
    @Input() projectId: string;
    private confScoreHistArray = new Array<HistgramBin>();
    private clusterRatioHistArray = new Array<HistgramBin>();
    private clusterSizeHistArray = new Array<HistgramBin>();

    private scores = [];
    private ratios = [];
    private sizes = [];

    private activedConfScoreBin = new RankAndValue(-1, 0);
    private activedClusterSizeBin = new RankAndValue(-1, 0);
    private activedClusterRatioBin = new RankAndValue(-1, 0);

    private activedConfScoreBinRange = new Array<{rank: number, value: number}>();
    private activedClusterSizeBinRange = new Array<{rank: number, value: number}>();
    private activedClusterRatioBinRange = new Array<{rank: number, value: number}>();
    
    constructor(private statisticsService: StatisticsService, private router: Router) {
        this.activedPsm = new Psm("null");
        this.activePsmIndex = 1;
        this.sortField = "confidentScore";
    }

    ngOnInit(): void {
      // console.log(this.sortField);
      //   if(this.confScoreHistArray!=null && this.confScoreHistArray.length>=1)
      //       return;
        if (this.psmType == "newid" && (this.confScoreHistArray ==null || this.confScoreHistArray.length < 1)) {
            // this.statisticsService.getHistData(this.projectId,this.psmType, "recommConfScore").then(bins=>{this.confScoreHistArray = bins;} );
            var promise1 =this.statisticsService.getHistData(this.projectId,this.psmType, "recommConfScore");
        }

        else if (this.psmType != "newid" && (this.confScoreHistArray==null || this.confScoreHistArray.length < 1)) {
            // this.statisticsService.getHistData(this.projectId,this.psmType, "confScore").then(bins=>{this.confScoreHistArray = bins;} );
            var promise1 =this.statisticsService.getHistData(this.projectId,this.psmType, "confScore");
        }

        if (this.clusterRatioHistArray == null || this.clusterRatioHistArray.length < 1) {
            var promise2 = this.statisticsService.getHistData(this.projectId,this.psmType, "clusterRatio");
            // this.statisticsService.getHistData(this.projectId,this.psmType, "clusterRatio").then(
            //     bins=>{
            //         this.clusterRatioHistArray = bins;
            //     });
        }

        if (this.clusterSizeHistArray==null || this.clusterSizeHistArray.length < 1) {
            // this.statisticsService.getHistData(this.projectId,this.psmType, "clusterSize").then(bins=>{this.clusterSizeHistArray = bins});
            var promise3 = this.statisticsService.getHistData(this.projectId,this.psmType, "clusterSize");
        }

        Promise.all([promise1,promise2, promise3]).then(values => {
            // console.log(values);
            this.confScoreHistArray = values[0];
            this.clusterRatioHistArray = values[1];
            this.clusterSizeHistArray = values[2];
            this.ngOnChanges();
        });
    }

    ngOnChanges(): void {
        if(this.activedPsm) {
            if (this.sortField === 'confidentScore') {
                let scoreRank = this.getBinRank(this.confScoreHistArray, this.activedPsm.confidentScore);
                this.activedConfScoreBin = {
                    "rank": scoreRank,
                    "value": this.activedPsm.confidentScore || this.activedPsm.recommConfidentScore
                };
            } else {
                let scoreRank = this.getBinRank(this.confScoreHistArray, this.activedPsm.confidentScore);
                this.activedConfScoreBin = {
                    "rank": scoreRank,
                    "value": this.activedPsm.confidentScore || this.activedPsm.recommConfidentScore
                };
            }
            if (this.sortField === 'recommConfidentScore' && this.router.url.split('/')[1] == 'new_id') {
                let scoreRank = this.getBinRank(this.confScoreHistArray, this.activedPsm.recommConfidentScore);
                this.activedConfScoreBin = {
                    "rank": scoreRank,
                    "value": this.activedPsm.recommConfidentScore
                };
            }

            let ratioRank = this.getBinRank(this.clusterRatioHistArray, this.activedPsm.clusterRatio);
            this.activedClusterRatioBin = {
                "rank": ratioRank,
                "value": this.activedPsm.clusterRatio
            }

            let sizeRank = this.getBinRank(this.clusterSizeHistArray, this.activedPsm.clusterSize);
            this.activedClusterSizeBin = {
                "rank": sizeRank,
                "value": this.activedPsm.clusterSize
            }
        }
        if(this.activedPage) {
            let confScoreRange = [{rank: -1, value: 0}, {rank: -1, value: 0}];  //one is lowest, another is highest
            confScoreRange[0].rank = this.getBinRank(this.confScoreHistArray, this.activedPage[0].confidentScore || this.activedPage[0].confidentScore)
            confScoreRange[0].value = this.activedPage[0].confidentScore;
            confScoreRange[1].rank = this.getBinRank(this.confScoreHistArray, this.activedPage[this.activedPage.length - 1].confidentScore)
            confScoreRange[1].value = this.activedPage[this.activedPage.length - 1].confidentScore;
            this.activedConfScoreBinRange = confScoreRange;
            // console.log(confScoreRange);

            let clusterRatioRange = [{rank: -1, value: 0}, {rank: -1, value: 0}];  //one is lowest, another is highest
            clusterRatioRange[0].rank = this.getBinRank(this.clusterRatioHistArray, this.activedPage[0].clusterRatio)
            clusterRatioRange[0].value = this.activedPage[0].clusterRatio;
            clusterRatioRange[1].rank = this.getBinRank(this.clusterRatioHistArray, this.activedPage[this.activedPage.length - 1].clusterRatio)
            clusterRatioRange[1].value = this.activedPage[this.activedPage.length - 1].clusterRatio;
            this.activedClusterRatioBinRange = clusterRatioRange;

            let clusterSizeRange = [{rank: -1, value: 0}, {rank: -1, value: 0}];  //one is lowest, another is highest
            clusterSizeRange[0].rank = this.getBinRank(this.clusterSizeHistArray, this.activedPage[0].clusterSize)
            clusterSizeRange[0].value = this.activedPage[0].clusterSize;
            clusterSizeRange[1].rank = this.getBinRank(this.clusterSizeHistArray, this.activedPage[this.activedPage.length - 1].clusterSize)
            clusterSizeRange[1].value = this.activedPage[this.activedPage.length - 1].clusterSize;
            this.activedClusterSizeBinRange = clusterSizeRange;

            this.scores = this.activedPage.map((p) => p.confidentScore);
            this.ratios = this.activedPage.map((p) => p.clusterRatio);
            this.sizes  = this.activedPage.map((p) => p.clusterSize);
        }
    };

    getBinRank(histogramArray:any[], score:number):number{
        if(histogramArray==null || histogramArray.length < 1) return -1;
        if(score <= histogramArray[0].upperBound) {
            return histogramArray[0].rank;
        }
        if(score >= histogramArray[histogramArray.length -1].lowerBound) {
            return histogramArray[histogramArray.length -1].rank;
        }
        // 这里精确找出了区间但是需要确定便捷 >= 或　<= 应该用在　uper 还是 lower
        // 另外rank数值不准确，当返回区间画图数据只有14条，最后一条的rank为20，应该为14会导致一些缺失数据最大值或者没法高亮。需要结局数据问题。
        let bin
        histogramArray.forEach((item, index) => {
            if (score >= item.lowerBound && score <= item.upperBound) {
                bin = item.rank
            }
        })
        return bin
        // let binSize = histogramArray[1].upperBound - histogramArray[1].lowerBound; //the second bin is the really start of the histogram
        // console.log(score)
        // let min = histogramArray[1].lowerBound;
        // console.log((score - min) / binSize)
        // let bin = Math.floor(((score - min) / binSize)) + 2;
        // return bin;
    }
        // //overwrite, not sure is right
        // let i, bin = -1;
        // for(i = 0;i < histogramArray.length - 1;i++) {
        //     if(score > histogramArray[i].upperBound && score < histogramArray[i + 1].upperBound) {
        //         bin = i + 1;
        //         break;
        //     }
        // }
        // return bin;


    // getBinRange(histogramArray: any[], top: number, btm: number): any {
    //     let range = [{rank: 0, lower: 0},
    //                  {rank: 0, top: 0},
    //                  {rank: 0, avtivedPsmValue: 0}];

    //     if(histogramArray.length < 1) return range;
    // }

}
