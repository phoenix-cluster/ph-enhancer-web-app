import {Component, Input, OnChanges, OnInit,SimpleChanges} from "@angular/core";
import {StatisticsService} from "../../../../services/statistics.service";
import {ConfigService} from "../../../../services/config.service";
import {VennData} from "../../../../model/vennData";
import {Router} from "@angular/router";
import{Chart1Component,ChangeProject} from "../chart1/chart1.component"

///import { colorSets, id } from '../../../../../../node_modules/_@swimlane_ngx-charts@6.1.0@@swimlane/ngx-charts/release/utils';
// import { AfterContentInit, AfterViewInit } from '../../../../../../node_modules/_@angular_core@5.1.3@@angular/core/src/metadata/lifecycle_hooks';
import { document } from "app/typescripts/free/utils/facade/browser";
import {project} from "../../../../../schema/checkExam";

@Component({
    selector: 'app-chart3',
    templateUrl: './chart3.component.html',
    styleUrls: ['./chart3.component.scss'],
})
export class Chart3Component implements OnChanges,OnInit{

    @Input() vennDataList: VennData[];
    @Input() changeProject:ChangeProject;
    multi: any[] = [];
    projects: any[] = [];
    sortDirection: string = 'desc';
    totalPSMInProject = {};
    // yMulti:any[] = [];
    view: any[] = [400, 480];
    nodes:any;
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
        domain: ['gray', '#A10A28', 'blue', '#10c008', 'light blue', "purple"]
    };
    constructor(private router: Router, private statisticsService: StatisticsService,
                private configService:ConfigService) {
        this.sortDirection = 'desc';
    }
    
    ngOnInit():void{
        this.setDataForChart(this.sortDirection, 0);
        this.multi=[...this.multi];
    }
   
    ngOnChanges(changes: SimpleChanges): void {      
        if(this.changeProject.selectedProject){
           this.multi=[];
           this.setProjectValue(this.changeProject.selectedProject);
        }else{
            if(this.changeProject.selectedProject==""){
                this.multi=[];
                this.setDataForChart(this.sortDirection, 0);
                this.multi = [...this.multi];
                this.projects=[...this.projects];
                // this.totalPSMInProject=[...this.totalPSMInProject];
            }else{
                return;
            }


        }
       

    }

   //set the data for chart1 and chart3
    setDataForChart(sortDirection, index) {
      let  subVennDataList=JSON.parse(JSON.stringify(this.vennDataList));
      let limit=index+10;
      let subMulit=[];
      this.projects=[];
      this.totalPSMInProject={};
     subVennDataList.forEach(
            vennData => {
                let anObject = new Object;
                let value=0;
                let valueCount=[];
                anObject["name"] = vennData.projectId;
                anObject["series"] = [];
                anObject["series"].push(
                    {
                        "name": "NotMatched Id",
                        "value": Math.abs(vennData.prePSM_no - vennData.matched_id_spec_no)
                    });
                anObject["series"].push(
                    {
                        "name": "Better Id",
                        "value": Math.abs(vennData.better_PSM_no)
                    });
                anObject["series"].push(
                    {
                        "name": "Other LowConf Id",
                        "value": Math.abs(vennData.prePSM_low_conf_no - vennData.better_PSM_no)
                    });
                anObject["series"].push(
                    {
                        "name": "High Confident Id",
                        "value": Math.abs(vennData.prePSM_high_conf_no)
                    });

                anObject["series"].push(
                    {
                        "name": "Other Matched Id",
                        "value": Math.abs(vennData.matched_id_spec_no - vennData.prePSM_low_conf_no - vennData.prePSM_high_conf_no)
                    });
                anObject["series"].push(
                    {
                        "name": "New Id for Matched UnId",
                        "value": Math.abs(vennData.new_PSM_no),
                    });
                anObject["series"].push(
                    {
                        "name": "Other Matched UnId",
                        "value":Math.abs(vennData.matched_spec_no - vennData.matched_id_spec_no - vennData.new_PSM_no)
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
                this.projects.push(valueCount);
                this.totalPSMInProject[vennData.projectId]=value;
                this.multi.push(anObject);
            }
        );
       this.projects.sort(this.sortbyValue);
       // console.log(this.projects);
       let projectValues=JSON.parse(JSON.stringify(this.projects));
       //处理当选择升降序排序，联动出现找不到projectId的问题
       // projectValues.sort(this.sortbyDefaultValue);
       console.log(projectValues);
       projectValues.sort(function(x,y){
           if(sortDirection == 'desc'){
               return y[0].value - x[0].value;
           }
           else if(sortDirection == 'asc'){
               return x[0].value - y[0].value;
           }
           else{console.error("this.sortDirection is wrong! " + sortDirection)}
       });
       console.log(projectValues);
       let projectValuesInWindow = projectValues.slice(index,limit);
       projectValuesInWindow.sort(this.sortbyValue);
       projectValuesInWindow.forEach(project=>{
            this.multi.forEach(item=>{
                if(project[0].name.search(item.name)!=-1){
                     subMulit.push(item);
                }
   
           })

        })
        this.multi=JSON.parse(JSON.stringify(subMulit));
        console.log(this.multi);
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
            case "High Confident Id":{
                psmTableType = "high_conf";
                break;
            }
            default:{
                alert(psmTableType);
                break;
            }
        }
       if (psmTableType !== null) {
            this.router.navigateByUrl('' + projectId + "/" + psmTableType).then(_ =>{console.log("route changed")});
       }

    }


    //link chart1 with chart3 for interactive
    linkChart3(element,proectId){ 
     
        if(undefined!=document.getElementsByClassName('showStyle')[0]){
                document.getElementsByClassName('showStyle')[0].classList.remove('showStyle');
           }
           let projectId=proectId;//获取点击的对象的节点项目ID
           element.classList.add("showStyle");
           this.dynamics(projectId);
    }


    //获取chart1选择项目对应chart3的Dom节点
    setProjectValue(value){
        let me=this;
        let subMaxValue=JSON.parse(JSON.stringify(this.projects));
        let projectId=[];
        subMaxValue.forEach(element => {
           projectId.push(element[0].name);
        });
        //判断是否chart1选择项目是否处理chart3当前的页面
        let projectIdIndex=projectId.indexOf(value);
        this.multi=[];
         //处理当选择升降序排序，联动出现找不到projectId的问题
        if(undefined!= document.getElementsByClassName("val_sort_cur")[0]){
            this.sortbyDefaultValue= this.sortbyValue=function(x, y,param1=1,param2=-1){
                return x[0].value > y[0].value ? param1:param2 
              }
        }else{
            this.sortbyDefaultValue= this.sortbyValue=function(x, y,param1=-1,param2=1){
                return x[0].value > y[0].value ? param1:param2
            }
        }
        this.setDataForChart(this.sortDirection, Math.trunc(projectIdIndex/10)*10);
        //联动时，处理chart3图表切换时事务的问题，强制渲染结束
        setTimeout(function(){
            let projects=document.getElementsByClassName('tick');
            projects=Array.from(projects);
            for(let element of projects){
              if (element.innerHTML.search(value)!=-1){
                    me.linkChart3(element,value);
                    break;
                }
            };
        },0)
    }

    onClick(event){
        // 截留判断
        const re = /[a-z]/i
        if (event.srcElement.tagName !== 'text' || !re.test(event.srcElement.innerHTML)) return
        //联动chart1的饼图
        let chart1Component=new Chart1Component(this.router,this.statisticsService, this.configService);
        chart1Component.setSelectedProject(event.srcElement.innerHTML.trim());
        chart1Component.getVennDataAndDraw();
        //联动chart3图的点击事件处理
        if(undefined!=document.getElementsByClassName('showStyle')[0]){
             document.getElementsByClassName('showStyle')[0].classList.remove('showStyle');
        }
        let projectId = event.srcElement.innerHTML;//获取点击的对象的节点项目ID
        event.srcElement.classList.add("showStyle");
        this.dynamics(projectId);
    }

    leftOnclick(event){
        document.getElementsByClassName("right")[0].classList.remove("ven_cur");
        let currenIndex=this.projects[0][0].param;
        if(currenIndex==10){
            event.currentTarget.classList.add("ven_cur");
        }else{
            event.currentTarget.classList.remove("ven_cur");
            currenIndex=currenIndex-20;
            this.multi=[];
            this.projects=[];
            this.setDataForChart(this.sortDirection, currenIndex);
            //处理y轴显示
            let yValue=[];
            this.projects.forEach(element => {
                yValue.push(element[0].value);
            });
            yValue.sort();
            this.setMaxYScal();
        }
    }

    rightOnclick(event){
        document.getElementsByClassName("left")[0].classList.remove("ven_cur");
        let currenIndex=this.projects[0][0].param;
        if(currenIndex>=this.vennDataList.length){
            event.currentTarget.classList.add("ven_cur");
        }
        else{
            event.currentTarget.classList.remove("ven_cur");
            this.multi=[];
            this.projects=[];
            this.setDataForChart(this.sortDirection, currenIndex);
            //处理y轴显示
            let yValue=[];
            this.projects.forEach(element => {
                yValue.push(element[0].value);
            });
            yValue.sort();
            // console.log(yValue);
            // console.log(this.yScaleMax);
            this.setMaxYScal();
            // console.log(this.projects);
        }
       
      
    }
    upClick(event){ 
        if(undefined!=document.getElementsByClassName('showStyle')[0]){
            document.getElementsByClassName('showStyle')[0].classList.remove('showStyle');
       }
        document.getElementsByClassName("down")[0].classList.remove("sort_cur");
        document.getElementsByClassName("up")[0].classList.add("sort_cur"); 
        document.getElementsByClassName("up")[0].classList.add("val_sort_cur"); 
        this.sortbyValue=function(x, y,param1=1,param2=-1){
           return x[0].value > y[0].value ? param1:param2
         }

         this.sortDirection = 'asc';
         this.multi=[];
         this.projects=[];
         this.setDataForChart(this.sortDirection,0);
         this.setMaxYScal();
       }

    downClick(event){
        if(undefined!=document.getElementsByClassName('showStyle')[0]){
            document.getElementsByClassName('showStyle')[0].classList.remove('showStyle');
        }
        document.getElementsByClassName("up")[0].classList.remove("val_sort_cur");
        document.getElementsByClassName("up")[0].classList.remove("sort_cur");
        document.getElementsByClassName("down")[0].classList.add("sort_cur");  
           this.sortbyValue=function(x, y,param1=-1,param2=1){
             return x[0].value > y[0].value ? param1:param2
           }
           this.sortDirection = 'desc';
           this.multi=[];
           this.projects=[];
           this.setDataForChart(this.sortDirection,0);
            this.setMaxYScal();
       }

    sortbyValue(x, y,param1=-1,param2=1){
        return x[0].value > y[0].value ? param1:param2
    }
    sortbyDefaultValue(x, y,param1=-1,param2=1){
        return x[0].value > y[0].value ? param1:param2
    }


    //set the max value of y axes
    setMaxYScal(){
        this.yScaleMax = 0;
        for(let i in this.multi){
                let project = this.multi[i];
                let project_name = project.name;
                if(this.yScaleMax < this.totalPSMInProject[project_name]){
                    this.yScaleMax = this.totalPSMInProject[project_name];
                }
            }
    }

    sortbyDirection(x,y){
        if (this.sortDirection == 'asc'){
            return x[0].value - y[0].value
        }
        else if (this.sortDirection == 'desc'){
            return y[0].value - x[0].value
        }
        else{
            console.error("sortDirection " + this.sortDirection + "is not right!")
        }
    }

  
  dynamics(projectId){
    this.multi=[];
    this.multi=JSON.parse(JSON.stringify(this.multi));
    let elements=document.getElementsByClassName("data-type");
    let projectValue;
    this.projects.forEach(element => {
       if(projectId.search(element[0].name)!=-1){
        projectValue=element[0].value;
       }
    });
   this.projects.forEach(element => {
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
  
}
