import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-conf-score-chart',
  templateUrl: './conf-score-chart.component.html',
  styleUrls: ['./conf-score-chart.component.scss']
})
export class ConfScoreChartComponent implements OnInit {

  constructor() {
    // Object.assign(this, {single})
  }
  single: any[];
  multi: any[];

  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  onSelect(event) {
    console.log(event);
  }
  ngOnInit() {
  }

}
