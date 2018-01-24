import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  private projectId:string;
  constructor() {
    this.projectId = "PXD001464";
  }

  ngOnInit() {
  }

}
