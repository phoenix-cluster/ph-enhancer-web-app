import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-right-analysis',
  templateUrl: './main-right-analysis.component.html',
  styleUrls: ['./main-right-analysis.component.scss']
})
export class MainRightAnalysisComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  refreshPage(){
      location.reload();
  }
}
