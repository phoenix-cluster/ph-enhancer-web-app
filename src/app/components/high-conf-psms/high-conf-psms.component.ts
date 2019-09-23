import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-high-conf-psms',
  templateUrl: './high-conf-psms.component.html',
  styleUrls: ['./high-conf-psms.component.scss']
})
export class HighConfPsmsComponent implements OnInit {

    constructor(private route: ActivatedRoute) { }
    public project : string;
    ngOnInit() {
        this.project = this.route.snapshot.paramMap.get('project');
    }
}
