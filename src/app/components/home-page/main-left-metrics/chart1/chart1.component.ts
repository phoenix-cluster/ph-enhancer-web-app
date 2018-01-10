import {Component, OnInit} from '@angular/core';
import * as d3 from 'd3';
import * as venn from 'venn.js/venn.js';


@Component({
    selector: 'app-chart1',
    templateUrl: './chart1.component.html',
    styleUrls: ['./chart1.component.scss']
})
export class Chart1Component implements OnInit {

    constructor() {
    }

    public chartType: string = 'radar';

    public chartDatasets: Array<any> = [
        {data: [65, 59, 80, 81, 56, 55, 40], label: 'My First dataset'},
        {data: [28, 48, 40, 19, 86, 27, 90], label: 'My Second dataset'}
    ];

    public chartLabels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

    public chartColors: Array<any> = [
        {
            backgroundColor: 'rgba(220,220,220,0.2)',
            borderColor: 'rgba(220,220,220,1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(220,220,220,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(220,220,220,1)'
        },
        {
            backgroundColor: 'rgba(151,187,205,0.2)',
            borderColor: 'rgba(151,187,205,1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(151,187,205,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(151,187,205,1)'
        }
    ];

    public chartOptions: any = {
        responsive: true
    };

    public chartClicked(e: any): void {

    }

    public chartHovered(e: any): void {

    }

    /* can not show each intersection's number, don't use it
    ngOnInit() {
        var sets = [
            {"sets": [0], "label": "Original_Identified", "size": 500, "": "Nonmatched size: 400"},
            {"sets": [1], "label": "Cluster_Matched", "size": 400, "": "New identified size: 300"},
            {"sets": [2], "label": "Low_Confident", "size": 30},

            {"sets": [0, 1], "size": 100},
            {"sets": [0, 2], "size": 30},
            {"sets": [1, 2], "size": 30},
            {"sets": [0, 1, 2], "size": 30},
        ]

        function getIntersectionAreasMapping() {
            let intersectionAreasMapping = {};
            let vennAreas = d3.selectAll(".venn-area");
            vennAreas.each((areaData, areaIdx, areas) => {
                let area = areas[areaIdx];
                let areaSets = areaData.sets;
                let areaSelection = d3.select(area);
                let areaD = areaSelection.select("path").attr("d");
                let areaSetsId = area.dataset.vennSets;
                let intersectedAreas = d3.selectAll(".venn-area")
                    .filter((cAreaData, cAreaIdx, cAreas) => {
                        let cAreaSetsId = cAreas[cAreaIdx].dataset.vennSets;
                        let cAreaSets = cAreaData.sets;
                        let isContained = areaSets.every(setId => cAreaSets.indexOf(setId) > -1);
                        return (isContained && cAreaSetsId !== areaSetsId);
                    })
                    .nodes()
                    .map(intersectedArea => {
                        let intersectedAreaSelection = d3.select(intersectedArea);
                        return {
                            sets: intersectedAreaSelection.data()[0].sets,
                            d: intersectedAreaSelection.select("path").attr("d")
                        }
                    });

                intersectionAreasMapping[areaSetsId] = {
                    vennArea: {
                        sets: areaSets,
                        d: areaD
                    },
                    intersectedAreas: intersectedAreas
                };
            });
            return intersectionAreasMapping;
        }

        function appendVennAreaParts(svg, intersectionAreasMapping) {
            for (let areaSetsId in intersectionAreasMapping) {
                let intersectionAreasItem = intersectionAreasMapping[areaSetsId];
                let vennArea = intersectionAreasItem.vennArea;
                let intersectedAreas = intersectionAreasItem.intersectedAreas;
                let partId = getPartId(vennArea, intersectedAreas);
                let d = [vennArea.d].concat(intersectedAreas.map(intersectedArea => intersectedArea.d));
                appendVennAreaPart(svg, d.join(""), partId);
            }
        }

        function appendLabels(svg, labels) {
            labels.nodes().forEach(label => {
                svg.append(function () {
                    return label;
                });
            });
        }

        function appendVennAreaPart(svg, d, partId) {
            svg.append("g")
                .attr("class", "venn-area-part")
                .attr("venn-area-part-id", partId)
                .append("path")
                .attr("d", d)
                .attr("fill-rule", "evenodd");
        }

        function appendPatterns(defs) {
            let colors = ["none", "#009fdf"];
            colors.forEach((color, idx) => {
                let diagonal = defs.append("pattern")
                    .attr("id", "diagonal" + idx)
                    .attr("patternUnits", "userSpaceOnUse")
                    .attr("width", "10")
                    .attr("height", "10");
                diagonal.append('rect')
                    .attr("width", "10")
                    .attr("height", "10")
                    .attr("x", "0")
                    .attr("y", "0")
                    .attr("fill", color)
                    .attr("fill-opacity", "0.15");
                diagonal.append("path")
                    .attr("d", "M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2")
                    .attr("stroke", "#000000")
                    .attr("opacity", "1")
                    .attr("stroke-width", "1");
            })
        }

        function getPartId(vennArea, intersectedAreas) {
            let partId = "(" + vennArea.sets.join("∩") + ")";
            partId += intersectedAreas.length > 1 ? "\\(" : "";
            partId += intersectedAreas.length == 1 ? "\\" : "";
            partId += intersectedAreas.map(intersectedArea => intersectedArea.sets).map(set => "(" + set.join("∩") + ")").join("∪");
            partId += intersectedAreas.length > 1 ? ")" : "";
            return partId;
        }

        function bindVennAreaPartListeners() {
            div.selectAll("g")
                .on("mouseover", function (d, i) {
                    let node = d3.select(this);
                    console.log(node.attr("venn-area-part-id"));
                    let nodePath = node.select("path");
                    let nodeAlreadySelected = node.classed("selected");
                    nodePath.attr("style", nodeAlreadySelected ? "fill: url(#diagonal1)" : "fill: #009fdf; fill-opacity: 0.15");
                })
                .on("mouseout", function (d, i) {
                    let node = d3.select(this);
                    let nodePath = node.select("path");
                    let nodeAlreadySelected = node.classed("selected");
                    nodePath.attr("style", nodeAlreadySelected ? "fill: url(#diagonal0)" : "fill: #ffffff");
                })
                .on("click", function (d, i) {
                    let node = d3.select(this);
                    let nodePath = node.select("path");
                    let nodeAlreadySelected = node.classed("selected");
                    let nodePathStyle = (!nodeAlreadySelected ? "fill: url(#diagonal1)" : "fill: #ffffff");
                    nodePath.attr("style", nodePathStyle);
                    node.classed("selected", !nodeAlreadySelected);
                });
        }

        function removeOriginalVennAreas() {
            d3.selectAll("g.venn-area").remove();
        }

        var chart = venn.VennDiagram()
            .width(400)
            .height(500);
        let div = d3.select("#venn").datum(sets).call(chart);
        let svg = div.select("svg");
        let defs = svg.append("defs");
        let labels = div.selectAll("text").remove();
        let intersectionAreasMapping = getIntersectionAreasMapping();
        appendPatterns(defs);
        appendVennAreaParts(svg, intersectionAreasMapping);
        appendLabels(svg, labels);
        bindVennAreaPartListeners();
        console.log(svg);
        removeOriginalVennAreas();
    }*/

    ngOnInit() {

        var sets = [
            {"sets": [0], "label": "Original Identified", "size": 500, "addInfo": ", 400 unmatched"},
            {"sets": [1], "label": "Cluster Matched", "size": 400, "addInfo": ", 300 new identified"},
            {"sets": [2], "label": "Low Confident", "size": 30},

            {"sets": [0, 1], "size": 100},
            {"sets": [0, 2], "size": 30},
            {"sets": [1, 2], "size": 30},
            {"sets": [0, 1, 2], "size": 30},
        ]

        var chart = venn.VennDiagram()
            .width(400)
            .height(500);

        var div = d3.select("#venn")
        div.datum(sets).call(chart);

        var tooltip = d3.select("body").append("div")
            .attr("class", "venntooltip");

        div.selectAll("path")
            .style("stroke-opacity", 0)
            .style("stroke", "#fff")
            .style("stroke-width", 3)

        div.selectAll("g")
            .on("mouseover", function (d, i) {
                // sort all the areas relative to the current item
                venn.sortAreas(div, d);

                // Display a tooltip with the current size
                tooltip.transition().duration(400).style("opacity", .9);
                tooltip.text(d.size + " spectra");
                if (d.addInfo) {
                    tooltip.text(d.size + " spectra, " + d.addInfo);//show the complement set info
                }

                // highlight the current path
                var selection = d3.select(this).transition("tooltip").duration(400);
                selection.select("path")
                    .style("fill-opacity", d.sets.length == 1 ? .4 : .1)
                    .style("stroke-opacity", 1);
            })

            .on("mousemove", function () {
                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })

            .on("mouseout", function (d, i) {
                tooltip.transition().duration(400).style("opacity", 0);
                var selection = d3.select(this).transition("tooltip").duration(400);
                selection.select("path")
                    .style("fill-opacity", d.sets.length == 1 ? .25 : .0)
                    .style("stroke-opacity", 0);
            });
    }


}
