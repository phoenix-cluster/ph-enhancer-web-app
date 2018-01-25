import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {StatisticsService} from "../../../../services/statistics.service";
import {Config} from "../../../../model/config";
import {VennData} from "../../../../model/vennData";
import {Router} from '@angular/router'


@Component({
    selector: 'app-chart3',
    templateUrl: './chart3.component.html',
    styleUrls: ['./chart3.component.scss'],
})
export class Chart3Component implements OnChanges{

    @Input() vennDataList: VennData[];
    multi: any[] = [];

    view: any[] = [400, 500];

    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = false;
    showXAxisLabel = true;
    xAxisLabel = 'Projects';
    showYAxisLabel = true;
    yAxisLabel = 'PSMs';

    colorScheme = {
        domain: ['gray', '#A10A28', 'blue', '#10c008', 'purple', "pink"]
    };

    constructor(private router: Router) {}

    ngOnChanges(): void {
        this.setDataForChart();
        this.multi = [...this.multi];
    }

    setDataForChart() {
        this.vennDataList.forEach(
            vennData => {
                let anObject = new Object;
                anObject["name"] = vennData.projectId;
                anObject["series"] = [];
                anObject["series"].push(
                    {
                        "name": "NotMatched Id",
                        "value": vennData.prePSM_no - vennData.matched_id_spec_no
                    });
                anObject["series"].push(
                    {
                        "name": "Better Id",
                        "value": vennData.better_PSM_no
                    });
                anObject["series"].push(
                    {
                        "name": "Other LowConf Id",
                        "value": vennData.prePSM_low_conf_no - vennData.better_PSM_no
                    });
                anObject["series"].push(
                    {
                        "name": "Other Matched Id",
                        "value": vennData.matched_id_spec_no - vennData.prePSM_low_conf_no
                    });
                anObject["series"].push(
                    {
                        "name": "New Id for Matched UnId",
                        "value": vennData.new_PSM_no
                    });
                anObject["series"].push(
                    {
                        "name": "Other Matched UnId",
                        "value": vennData.matched_spec_no - vennData.matched_id_spec_no - vennData.new_PSM_no
                    });
                this.multi.push(anObject);
            }
        );
    }

    onSelect(event){
        console.log(event);
        let projectId = event.series;
        let vennDataType = event.name;
        let vennDataValue = event.value;
        let psmTableType = null;
        switch (vennDataType){
            case "New Id for Matched UnId" :{
                psmTableType = "new_id";
                alert(psmTableType);
                break;
            }

            case "Better Id":
            case "Other LowConf Id":{
                psmTableType = "low_conf";
                alert(psmTableType);
                break;
            }

            case "Other Matched Id":{
                psmTableType = "high_conf";
                alert(psmTableType);
                break;
            }

            default:{
                alert(psmTableType);
                break;
            }
        }
        console.log(psmTableType);
        // this.router.navigate([psmTableType, projectId]);
        this.router.navigateByUrl('' + psmTableType + "/" + projectId).then(_ =>{console.log("route changed")});

    }


}
