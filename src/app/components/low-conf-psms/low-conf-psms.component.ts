import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-low-conf-psms',
  templateUrl: './low-conf-psms.component.html',
  styleUrls: ['./low-conf-psms.component.scss']
})
export class LowConfPsmsComponent implements OnInit {
  public project : string;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
      this.project = this.route.snapshot.paramMap.get('project');
  }

}
