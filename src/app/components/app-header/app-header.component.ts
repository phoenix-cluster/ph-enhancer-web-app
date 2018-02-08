import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Config} from '../../model/config';
import {NavigationEnd, Router} from "@angular/router";

@Component({
    selector: 'app-header',
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
    projectId: string = Config.defaultProject;

    // constructor(@Inject(DOCUMENT) private document: Document) {
    // }
    constructor(private router: Router) {
    }

    ngOnInit() {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                let projectId = this.getProject(this.router.routerState.snapshot.url);
                if (projectId != null) {
                    this.projectId = projectId;
                }
            }
        });
    }

    getProject(currentUrl) {
        let dataType = null;
        let dataValue = null;
        let patern = /\/(\w+)\/(\w+)/g;
        let a = patern.exec(currentUrl);
        if (a) {
            dataType = a[1];
            dataValue = a[2];
            if (dataType == 'low_conf' || dataType == 'high_conf' || dataType == 'new_id') {
                let projectId = dataValue;
                return projectId;
            } else {
                return Config.defaultProject;
            }
        }
        return null;

        // let patern = /\/(\w+)/g;
        // if(patern.test(currentUrl)){
        //     return null;
        // }
    }

    getClass(pagetype: string): string {
        let currentUrl = this.router.routerState.snapshot.url;
        let dataType = null;
        let patern = /\/(\w+)\/(\w+)/g;
        let a = patern.exec(currentUrl);
        if (a) {
            dataType = a[1];
            if (dataType == pagetype ) {
                return "activePage";
            }else{
                return "deactivePage";
            }
        }
        patern = /\/(\w+)/g;
        a = patern.exec(currentUrl);
        if (a) {
            dataType = a[1];
            if (dataType == pagetype ) {
                return "activePage";
            }else{
                return "deactivePage";
            }
        }


    }
}
