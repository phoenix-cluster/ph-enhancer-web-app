import {Component, Input, OnChanges, OnInit,SimpleChanges} from "@angular/core";
import {StatisticsService} from "../../../../services/statistics.service";
import {Config} from "../../../../model/config";
import {VennData} from "../../../../model/vennData";
import {Router} from "@angular/router";
import{Chart1Component,ChangeProject} from "../chart1/chart1.component"

///import { colorSets, id } from '../../../../../../node_modules/_@swimlane_ngx-charts@6.1.0@@swimlane/ngx-charts/release/utils';
import { AfterContentInit, AfterViewInit } from '../../../../../../node_modules/_@angular_core@5.1.3@@angular/core/src/metadata/lifecycle_hooks';
import { document } from "app/typescripts/free/utils/facade/browser";



@Component({
    selector: 'app-chart3',
    templateUrl: './chart3.component.html',
    styleUrls: ['./chart3.component.scss'],
})
export class Chart3Component implements OnChanges,OnInit{

    @Input() vennDataList: VennData[];
    @Input() changeProject:ChangeProject;
    multi: any[] = [];
    maxValue: any[] = [];
    yMulti:any[] = [];
    view: any[] = [400, 500];
    nodes:any;
    config:Config
    changeValue=this.changeProject;
  
    // options
    showXAxis = true;
    showYAxis = true;
    gradient = true;
    showLegend = false;
    showXAxisLabel = true;
    xAxisLabel = 'Projects';
    showYAxisLabel = true;
    yAxisLabel = 'PSMs';
    fitContainer: boolean = true;
    showSeriesOnHover = true;
    roundEdges: boolean = true;
    animations: boolean = true;
    roundDomains = false;
    yScaleMax=0;
    colorScheme = {
        domain: ['gray', '#A10A28', 'blue', '#10c008', 'purple', "pink"]
    };
    constructor(private router: Router, private statisticsService: StatisticsService) {
    }
    
    ngOnInit():void{
        this.setDataForChart(0);
        this.yMulti=[...this.yMulti];
    }
   
    ngOnChanges(changes: SimpleChanges): void {
        
        if(this.changeProject.selectedProject){
           this.multi=[];
           this.setProjectValue(this.changeProject.selectedProject);
        }else{
            if(this.changeProject.selectedProject==""){
                this.multi=[];
                this.setDataForChart(0);
                this.multi = [...this.multi];
                this.maxValue=[...this.maxValue];
            }else{
                return;
            }


        }
       

    }

    setDataForChart(index) {
      let  subVennDataList=JSON.parse(JSON.stringify(this.vennDataList));
      let limit=index+10;
      let subMulit=[];
      let  vennDataList1=subVennDataList.slice(index,10+index);
        vennDataList1.forEach(
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
                    "value":value,
                    "param":limit
                })
                 //存放全部项目的ID和总值 
                this.maxValue.push(valueCount);
                this.multi.push(anObject);
                this.yMulti.push(anObject);        
            }
        );

       this.maxValue.sort(this.sortbyValue);
        this.maxValue.forEach(project=>{
            this.multi.forEach(item=>{
                if(project[0].name.search(item.name)!=-1){
                     subMulit.push(item);
                }
   
           })

        })
        this.multi=JSON.parse(JSON.stringify(subMulit));
        this.yMulti=JSON.parse(JSON.stringify(subMulit));   
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
    //chart1联动chart3
    linkChart3(element,proectId){ 
     
        if(undefined!=document.getElementsByClassName('showStyle')[0]){
                document.getElementsByClassName('showStyle')[0].classList.remove('showStyle');
           }
           this.multi=[];
           this.multi=JSON.parse(JSON.stringify(this.yMulti));
           let elements=document.getElementsByClassName("data-type");
           let projectId=proectId;//获取点击的对象的节点项目ID
           element.classList.add("showStyle");
           let projectValue;
           this.maxValue.forEach(element => {
              if(projectId.search(element[0].name)!=-1){
               projectValue=element[0].value;
              }
           });
          this.maxValue.forEach(element => {
           //超过y轴分界线的项目隐藏
           if(element[0].value>projectValue){         
               for(let index=0;index<this.multi.length;index++){
                   if(element[0].name.search(this.multi[index].name)!=-1){    
                           let sumValue=0;
                           let laterProjectValue=false;
                           let forstLaterProjectValue=false;
                           let laterMaxValue=false;
                           let val=false;
                           //项目的子项目判断
                       this.multi[index].series.forEach(
                           function(item,location){
                               if(item.value<projectValue){
                                   if(!laterMaxValue){
                                   //判断是否是子项目的和第一次大于点击项目的最大值
                                      if(!val){                         
                                           sumValue=sumValue+item.value;
                                               if(sumValue>projectValue||sumValue==projectValue){
                                                   if(!laterProjectValue){
                                                       let midValue=sumValue-projectValue;
                                                       item.value=item.value-midValue;
                                                       laterProjectValue=true;
                                                       
                                                   }else{
                                                       item.value=0;
                                                   }   
                                               }else{
                                                   forstLaterProjectValue=true;
                                               }
                                       }
                                       else{
                                           item.value=0;
                                       }
                                  }else{
                                       item.value=0;
                                   }
                               }else{
                                   //判断是否是子项目第一次之后大于点击项目的值
                                   if(forstLaterProjectValue){
                                       if(!laterMaxValue){                 
                                           item.value=projectValue-sumValue;
                                           laterMaxValue=true;//表示已剪切过，后面的子项目应该清空
              
                                       }else{
                                           item.value=0;
                                       }
           
                                   }else{
                                       //判断是否是子项目第一次大于点击项目的值
                                       if(!val){
                                           item.value=projectValue;
                                           val=true;
                                       }
                                       else{                                 
                                           item.value=0;//如果是第一次子项目大于点击项目的值，之后的子项目的数据清零
                                       }                                                
                                   }
                               }
                                                                                                                 
                           });
         
                   }
           
               }                                          
           }
           
        });
       this.yScaleMax=projectValue;    
    }
    //获取chart1选择项目对应chart3的Dom节点
    setProjectValue(value){
        let subVennDataList=JSON.parse(JSON.stringify(this.vennDataList));
        let projectId=[];
        subVennDataList.forEach(element => {
           projectId.push(element.projectId);
        });
        //判断是否chart1选择项目是否处理chart3当前的页面
        let projectIdIndex=projectId.indexOf(value);
        this.multi=[];
        this.setDataForChart(Math.trunc(projectIdIndex/10)*10);
        let projects=document.getElementsByClassName('tick');
        projects=Array.from(projects);
        for(let element of projects){
          if (element.innerHTML.search(value)!=-1){
                this.linkChart3(element,value);
                break;
            }
        };
    }
    onClick(event){
        //联动chart1的饼图
        let chart1Component=new Chart1Component(this.router,this.statisticsService);
        chart1Component.set(event.srcElement.innerHTML.trim());
        chart1Component.getVennDataAndDraw();
        //联动chart3图的点击事件处理
        if(undefined!=document.getElementsByClassName('showStyle')[0]){
             document.getElementsByClassName('showStyle')[0].classList.remove('showStyle');
        }
        this.multi=[];
        this.multi=JSON.parse(JSON.stringify(this.yMulti));
        let elements=document.getElementsByClassName("data-type");
        let projectId=event.srcElement.innerHTML;//获取点击的对象的节点项目ID
        event.srcElement.classList.add("showStyle");
        let projectValue;
        this.maxValue.forEach(element => {
           if(projectId.search(element[0].name)!=-1){
            projectValue=element[0].value;
           }
        });
       this.maxValue.forEach(element => {
        //超过y轴分界线的项目隐藏
        if(element[0].value>projectValue){         
            for(let index=0;index<this.multi.length;index++){
                if(element[0].name.search(this.multi[index].name)!=-1){    
                        let sumValue=0;
                        let laterProjectValue=false;
                        let forstLaterProjectValue=false;
                        let laterMaxValue=false;
                        let val=false;
                        //项目的子项目判断
                    this.multi[index].series.forEach(
                        function(item,location){
                            if(item.value<projectValue){
                                if(!laterMaxValue){
                                //判断是否是子项目的和第一次大于点击项目的最大值
                                   if(!val){                         
                                        sumValue=sumValue+item.value;
                                            if(sumValue>projectValue||sumValue==projectValue){
                                                if(!laterProjectValue){
                                                    let midValue=sumValue-projectValue;
                                                    item.value=item.value-midValue;
                                                    laterProjectValue=true;
                                                    
                                                }else{
                                                    item.value=0;
                                                }   
                                            }else{
                                                forstLaterProjectValue=true;
                                            }
                                    }
                                    else{
                                        item.value=0;
                                    }
                               }else{
                                    item.value=0;
                                }
                            }else{
                                //判断是否是子项目第一次之后大于点击项目的值
                                if(forstLaterProjectValue){
                                    if(!laterMaxValue){                 
                                        item.value=projectValue-sumValue;
                                        laterMaxValue=true;//表示已剪切过，后面的子项目应该清空
           
                                    }else{
                                        item.value=0;
                                    }
        
                                }else{
                                    //判断是否是子项目第一次大于点击项目的值
                                    if(!val){
                                        item.value=projectValue;
                                        val=true;
                                    }
                                    else{                                 
                                        item.value=0;//如果是第一次子项目大于点击项目的值，之后的子项目的数据清零
                                    }                                                
                                }
                            }
                                                                                                              
                        });
      
                }
        
            }                                          
        }
        
     });
    
    this.yScaleMax=projectValue;
  
    }

    leftOnclick(event){
        document.getElementsByClassName("right")[0].classList.remove("ven_cur");
        let currenIndex=this.maxValue[0][0].param;
        if(currenIndex==10){
            event.currentTarget.classList.add("ven_cur");
        }else{
            event.currentTarget.classList.remove("ven_cur");
            currenIndex=currenIndex-20;
            this.yMulti=[];
            this.multi=[];
            this.maxValue=[];
            this.setDataForChart(currenIndex);
        }
    }
    rightOnclick(event){
        document.getElementsByClassName("left")[0].classList.remove("ven_cur");
        let currenIndex=this.maxValue[0][0].param;
        if(currenIndex>=this.vennDataList.length){
            event.currentTarget.classList.add("ven_cur");
        }
        else{
            event.currentTarget.classList.remove("ven_cur");
            this.yMulti=[];
            this.multi=[];
            this.maxValue=[];
            this.setDataForChart(currenIndex);
        }
       
      
    }
    upClick(event){ 
        document.getElementsByClassName("down")[0].classList.remove("sort_cur");
        document.getElementsByClassName("up")[0].classList.add("sort_cur");  
        this.sortbyValue=function(x, y,param1=1,param2=-1){
           return x[0].value > y[0].value ? param1:param2
   
         }
         let currenIndex=this.maxValue[0][0].param;
         this.yMulti=[];
         this.multi=[];
         this.maxValue=[];
         this.setDataForChart(currenIndex-10);
       
       }
       downClick(event){
        document.getElementsByClassName("up")[0].classList.remove("sort_cur");
        document.getElementsByClassName("down")[0].classList.add("sort_cur");  
           this.sortbyValue=function(x, y,param1=-1,param2=1){
             return x[0].value > y[0].value ? param1:param2
   
           }
           let currenIndex=this.maxValue[0][0].param;
           this.yMulti=[];
           this.multi=[];
           this.maxValue=[];
           this.setDataForChart(currenIndex-10);
       
       }
    sortbyValue(x, y,param1=-1,param2=1){
        return x[0].value > y[0].value ? param1:param2
    }

  
  
  
}

