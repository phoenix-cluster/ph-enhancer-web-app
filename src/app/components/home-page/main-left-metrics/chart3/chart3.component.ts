import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart3',
  templateUrl: './chart3.component.html',
  styleUrls: ['./chart3.component.scss']
})
export class Chart3Component implements OnInit {

  multi: any[];

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
    domain: ['#172e5a', '#A10A28', '#C7B42C', '#10c008']
  };

  constructor() {
    this.multi = [
      {
        "name": "PXD000021",
        "series": [
          {
            "name": "NonMatched",
            "value": 730
          },
          {
            "name": "Doubt PSMs",
            "value": 894
          },
          {
            "name": "Confident PSMs",
            "value": 940
          },
          {
            "name": "New PSMs",
            "value": 240
          }
        ]
      },
      {
        "name": "PXD000024",
        "series": [
          {
            "name": "NonMatched",
            "value": 730
          },
          {
            "name": "Doubt PSMs",
            "value": 894
          },
          {
            "name": "Confident PSMs",
            "value": 940
          },
          {
            "name": "New PSMs",
            "value": 240
          }
        ]
      },
      {
        "name": "PXD000025",
        "series": [
          {
            "name": "NonMatched",
            "value": 730
          },
          {
            "name": "Doubt PSMs",
            "value": 894
          },
          {
            "name": "Confident PSMs",
            "value": 940
          },
          {
            "name": "New PSMs",
            "value": 240
          }
        ]
      },
      {
        "name": "PXD000026",
        "series": [
          {
            "name": "NonMatched",
            "value": 730
          },
          {
            "name": "Doubt PSMs",
            "value": 894
          },
          {
            "name": "Confident PSMs",
            "value": 940
          },
          {
            "name": "New PSMs",
            "value": 240
          }
        ]
      },
    ];
  }

  ngOnInit() {
  }

}
