import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-low-conf-psms',
  templateUrl: './low-conf-psms.component.html',
  styleUrls: ['./low-conf-psms.component.scss']
})
export class LowConfPsmsComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  public project : string;
  ngOnInit() {
      this.project = this.route.snapshot.paramMap.get('project');
  }

}
