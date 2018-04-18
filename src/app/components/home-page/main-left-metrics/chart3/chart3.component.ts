import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {StatisticsService} from "../../../../services/statistics.service";
import {Config} from "../../../../model/config";
import {VennData} from "../../../../model/vennData";
import {Router} from '@angular/router'
// import { colorSets, id } from '../../../../../../node_modules/_@swimlane_ngx-charts@6.1.0@@swimlane/ngx-charts/release/utils';


@Component({
    selector: 'app-chart3',
    templateUrl: './chart3.component.html',
    styleUrls: ['./chart3.component.scss'],
})
export class Chart3Component implements OnChanges{

    @Input() vennDataList: VennData[];
    multi: any[] = [];
    maxValue: any[] = [];

    view: any[] = [400, 500];
    values;

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
                let value=0;
                let valueCount=[];
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
                //获取每个项目的总值  
                anObject["series"].forEach(it=>{
                    value=value+it.value;
                });
                //存放项目的ID和总值
                valueCount.push({
                    "name": vennData.projectId,
                    "value":value
                })
                 //存放全部项目的ID和总值 
                this.maxValue.push(valueCount);
                this.multi.push(anObject);
            }
        );
       
    }
    

    onSelect(event){
        let projectId = event.series;
        let vennDataType = event.name;
        let vennDataValue = event.value;
        let psmTableType = null;
        switch (vennDataType){
            case "New Id for Matched UnId" :{
                psmTableType = "new_id";
                break;
            }

            case "Better Id":
            case "Other LowConf Id":{
                psmTableType = "low_conf";
                break;
            }

            case "Other Matched Id":{
                psmTableType = "high_conf";
                break;
            }

            default:{
                alert(psmTableType);
                break;
            }
        }
       
        this.router.navigateByUrl('' + psmTableType + "/" + projectId).then(_ =>{console.log("route changed")});

    }

    onClick(event){
        let projectId=event.srcElement.innerHTML;//获取点击的对象的节点项目ID
        let projectValue;
        this.maxValue.forEach(element => {
           if(projectId.search(element[0].name)!=-1){
            projectValue=element[0].value;
           }
        });
       let yAxisValue=Math.ceil(projectValue/100000)==0?100000:Math.ceil(projectValue/100000)*100000;//y轴分界线
       this.maxValue.forEach(element => {
        let elements=document.getElementsByClassName("data-type");
        //超过y轴分界线的项目隐藏
        if(element[0].value>yAxisValue){      
            for(let i=0;i<elements.length;i++){
                if(elements[i].attributes["ng-reflect-series-name"].value.search(element[0].name)!=-1){
                            elements[i].classList.add('veenShow');
                            //elements[i].setAttribute("display","none");
                }
            }
           
        
        }else{
            //没超过y轴分界线的项目显示
            for(let i=0;i<elements.length;i++){
                if(elements[i].attributes["ng-reflect-series-name"].value.search(element[0].name)!=-1){
                            elements[i].classList.remove('veenShow');
                            //elements[i].setAttribute("display","none");
                }
            }
        }
        
        
     });
    
      
    }

   
}

