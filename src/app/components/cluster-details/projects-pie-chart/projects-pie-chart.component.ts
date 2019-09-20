import { Component, OnInit ,Input} from '@angular/core';
import * as d3 from 'd3';
import { Cluster } from '../../../model/cluster';
import { Spectrum } from '../../../model/spectrum';

@Component({
  selector: 'app-projects-pie-chart',
  templateUrl: './projects-pie-chart.component.html',
  styleUrls: ['./projects-pie-chart.component.scss']
})
export class ProjectsPieChartComponent implements OnInit {

  @Input() cluster : Cluster;
  constructor() { 
      this.cluster = new Cluster();
  }

  ngOnInit() {
  }
  ngOnChanges(){
    this.setProjectsRatios();
  }
  private setProjectsRatios(){
    if(this.cluster.spectraTitles==undefined){
        return;
    }
    let map = new Map<string,number>();
    let titles = this.cluster.spectraTitles;
    // console.log(titles);
    for(let i=0;i<titles.length;i++){
        let projectId = titles[i].substring(0,titles[i].indexOf(";"));
        // console.log(projectId);
        if(map.has(projectId))
            map.set(projectId,map.get(projectId)+1);
        else{
            map.set(projectId,1);
        }
    }
    let count_others = 0;
    let size = titles.length;
    // console.log(size);
    let jsonstr = "[]";
    let json_data = eval('('+jsonstr+')');
    map.forEach((value:number,key:string)=>{
        if(value<size*0.02){
            count_others += value;
            map.delete(key);
        }else{
            let item = {
                "name" : key,
                "value" : value
            }; 
            json_data.push(item);
        }
    });
    let item = {
        "name" : "others",
        "value" : count_others
    };
    json_data.push(item);
    this.drawRatioPie(json_data);
  }
  private drawRatioPie(data : any){

    let svg = d3.select("#project-pie").select("svg");
    let canvas = d3.select("#project-pie").select("#canvas");
    let art = d3.select("#project-pie").select("#art");
    let labels =d3.select("#project-pie").select("#labels");
    let jhw_pie = d3.pie().sort(null);
    jhw_pie.value(function (d, i) {
        return d.value;
    });
    let cDim = {
        height: 300,
        width: 450,
        innerRadius: 0,
        outerRadius: 100,
        labelRadius: 120
    };
    svg.attr("height",cDim.height)
       .attr("width",cDim.width);

    canvas.attr("transform", "translate(" + (cDim.width / 2 + 10) + "," + (cDim.height / 2 + 10) + ")");
    
    let pied_data = jhw_pie(data);
    let pied_arc = d3.arc()
        .innerRadius(40)
        .outerRadius(100);
    let pied_colors = d3.scaleOrdinal(d3.schemeCategory10);
    let enteringArcs = art.selectAll(".wedge").data(pied_data).enter();
    
    enteringArcs.append("path")
        .attr("class", "wedge")
        .attr("d", pied_arc)
        .style("fill", function (d, i) {
        return pied_colors(i);
    });
    
    let enteringLabels = labels.selectAll(".label").data(pied_data).enter();
    let labelGroups = enteringLabels.append("g").attr("class", "label");
    labelGroups.append("circle")
        .attr("x",0)
        .attr("y",0)
        .attr("r",2)
        .attr("fill","#000")
        .attr("transform",function (d, i) {
            let centroid = pied_arc.centroid(d);
            return "translate(" + pied_arc.centroid(d) + ")";})
        .attr("class","label-circle");

    let textLines = labelGroups.append("path").attr(
            "d", function(d,i){
            let x0 = pied_arc.centroid(d)[0];
            let y0 = pied_arc.centroid(d)[1];
            let centroid = pied_arc.centroid(d);
            let midAngle = Math.atan2(centroid[1], centroid[0]);
            let x1 = Math.cos(midAngle) * cDim.labelRadius;
                centroid = pied_arc.centroid(d);
            let x2 =  x1 > 0 ? 130 : -130;
                midAngle = Math.atan2(centroid[1], centroid[0]);
                centroid = pied_arc.centroid(d);
                midAngle = Math.atan2(centroid[1], centroid[0]);
            let y1 = Math.sin(midAngle) * cDim.labelRadius;
            let ret = [];
            ret.push("M",x0,y0,"L",x1,y1,"L",x2,y1);
            // console.log(ret.join(" "));
            return ret.join(" ");
    }).attr("style",
        "stroke:#1C90F3 ;fill:none");
    
    let textLabels = labelGroups.append("text")
            .attr("x", function (d, i) {
                let centroid = pied_arc.centroid(d);
                let midAngle = Math.atan2(centroid[1], centroid[0]);
                let x = Math.cos(midAngle) * cDim.labelRadius;
                return x > 0 ? 130 : -130;})
            .attr("y",function (d, i) {
                let centroid = pied_arc.centroid(d);
                let midAngle = Math.atan2(centroid[1], centroid[0]);
                let y = Math.sin(midAngle) * cDim.labelRadius;
                return y;})
            .attr("text-anchor", function (d, i) {
                let centroid = pied_arc.centroid(d);
                let midAngle = Math.atan2(centroid[1], centroid[0]);
                let x = Math.cos(midAngle) * cDim.labelRadius;
                return (x > 0) ? "start" : "end";})
            .attr("class","label-text");  

    textLabels.text(function (d) {
        return d.data.name;    
    });
    
    let alpha = 0.5;
    let spacing = 12;
    
    function relax() {
        let again = false;
        textLabels.each(function (d, i) {
            let a = this;
            let da = d3.select(a);
            let y1 = da.attr("y");
            textLabels.each(function (d, j) {
                let b = this;
                // a & b are the same element and don't collide.
                if (a == b) return;
                let db = d3.select(b);
                // a & b are on opposite sides of the chart and
                // don't collide
                if (da.attr("text-anchor") != db.attr("text-anchor")) return;
                // Now let's calculate the distance between
                // these elements. 
                let y2 = db.attr("y");
                let deltaY = y1 - y2;
                
                // Our spacing is greater than our specified spacing,
                // so they don't collide.
                if (Math.abs(deltaY) > spacing) return;
                
                // If the labels collide, we'll push each 
                // of the two labels up and down a little bit.
                again = true;
                let sign = deltaY > 0 ? 1 : -1;
                let adjust = sign * alpha;
                da.attr("y",+y1 + adjust);
                db.attr("y",+y2 - adjust);
            });
        });

        // Adjust our line leaders here
        // so that they follow the labels. 
        if(again) {
            let labelElements = textLabels._groups[0];
            
            textLines.attr("d", function(d,i){
                let x0 = pied_arc.centroid(d)[0];
                let y0 = pied_arc.centroid(d)[1];
                let	centroid = pied_arc.centroid(d);
                let midAngle = Math.atan2(centroid[1], centroid[0]);
                let x1 = Math.cos(midAngle) * cDim.labelRadius;
                let	x2 =  x1 > 0 ? 130 : -130;
                let y1 =d3.select(labelElements[i]).attr("y");
                let  ret = [];
            ret.push("M",x0,y0,"L",x1,y1,"L",x2,y1);

            return ret.join(" ");
    }).attr("style",
    "stroke:#1C90F3 ;fill:none");
            setTimeout(relax,20);
        }
    }
    
    relax();
  }


}
