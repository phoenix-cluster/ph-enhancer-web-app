import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import { Cluster } from '../../../model/cluster';
@Component({
  selector: 'app-sequences-pie-chart',
  templateUrl: './sequences-pie-chart.component.html',
  styleUrls: ['./sequences-pie-chart.component.scss']
})
export class SequencesPieChartComponent implements OnInit {

  @Input() ratioStr : string;
  @Input() cluster : Cluster;
  constructor() { }

  ngOnInit() {
    //   console.log(this.ratioStr);
    if(this.ratioStr!=undefined){
        this.setSeqRatios(this.ratioStr);
    }
  }
  ngOnChanges(){
      if(this.cluster!=undefined)
        if(this.cluster.sequencesRatios!=undefined)
            this.setSeqRatios(this.cluster.sequencesRatios);  
  }
  private setSeqRatios(seqRatios : any){
        let datastr = seqRatios.substring(1,seqRatios.length-1);
        let arr = datastr.split(",");
        let jsonstr="[]";
        let json_data = eval('('+jsonstr+')'); 
        let sum = 0;
        arr.forEach(element => {
           let map = element.split(":");
           let name = map[0].substring(1,map[0].length-1).replace("'","");
           let value = parseFloat(map[1]);
           if(value>0.01){
            let arr_i = {
                "name" : name,
                "value" : value 
            };
            sum += value;
            json_data.push(arr_i);
           }  
        });
        json_data.push({"name" : "others" ,
                        "value" : 1-sum});
       let data = json_data;
    // }
    this.drawRatioPie(data);
  }
  drawRatioPie(data : any){
      
    let svg = d3.select("#seq-pie").select("svg");
    let canvas = d3.select("#seq-pie").select("#canvas");
    let art = d3.select("#seq-pie").select("#art");
    let labels = d3.select("#seq-pie").select("#labels");
    
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

    canvas.attr("transform", "translate(" + (cDim.width / 2 + 10) + "," + (cDim.height / 2  + 20) + ")");
    
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
    
    // Now we'll draw our label lines, etc.
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
    // "When am I ever going to use this?" I said in 
    // 10th grade trig.
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
            setTimeout(relax,10);
        }
    }
    
    relax();
  }

}
