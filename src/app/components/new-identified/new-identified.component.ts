import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-new-identified',
  templateUrl: './new-identified.component.html',
  styleUrls: ['./new-identified.component.scss']
})
export class NewIdentifiedComponent implements OnInit {

    constructor(private route: ActivatedRoute) { }
    public project : string;
    ngOnInit() {
        this.project = this.route.snapshot.paramMap.get('project');
    }

}
