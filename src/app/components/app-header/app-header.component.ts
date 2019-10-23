import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT, PlatformLocation} from '@angular/common';
import {NavigationEnd, Router, Params, ActivatedRoute} from "@angular/router";
import {ConfigService} from "../../services/config.service";
import {CheckExamplesService, changedProjectId} from "../../services/checkExams/check-examples.service";

@Component({
    selector: 'app-header',
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
    public projectId: string ;
    // constructor(@Inject(DOCUMENT) private document: Document) {
    // }
    constructor(private router: Router, private configService: ConfigService, private routeInfo: ActivatedRoute, private checkExamService: CheckExamplesService, private location: PlatformLocation) {
        checkExamService.idEventer.subscribe(id => {
            checkExamService.projectId = id
        })
    }
    protected subscribeId: changedProjectId;
    ngOnInit() {
        /*this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                let projectId = this.getProject(this.router.routerState.snapshot.url);
                if (projectId != null) {
                    this.projectId = projectId;
                }
            }
        });*/
        this.getProjectId();
        // add address router parser and init refesh page, save url Info
        let currentUrl = this.location.pathname
        if (currentUrl.split('/')[2] === 'low_conf' || currentUrl.split('/')[2] === 'high_conf' || currentUrl.split('/')[2] === 'new_id') {
            console.log('yes')
            this.checkExamService.projectId = { id: currentUrl.split('/')[1] }
        } else {
            this.checkExamService.projectId = this.checkExamService.projectId;
        }
        this.subscribeId = this.checkExamService.projectId;
    }
    getProjectId() {
        this.configService.getConfig().then(configJson => {
            this.projectId = configJson.defaultProject;
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
                return this.configService.getConfig().then(configJson => {
                    this.projectId = configJson.defaultProject;
                    return configJson.defaultProject;
                });
            }
        }
        return null;

        // let patern = /\/(\w+)/g;
        // if(patern.test(currentUrl)){
        //     return null;
        // }
    }

    getClass(page: string): string {
        let currentUrl = this.router.routerState.snapshot.url;
        if (currentUrl === '/index') {
            if (page === 'index') {
                return 'activePage'
            } else {
                return 'deactivePage'
            }
        }
        let dataType = null;
        let patern = /\/(\w+)\/(\w+)/g;
        let a = patern.exec(currentUrl);
        if (a) {
            dataType = a[2];
            if (dataType === page ) {
                return "activePage";
            }else{
                return "deactivePage";
            }
        }
        patern = /\/(\w+)/g;
        a = patern.exec(currentUrl);
        if (a) {
            dataType = a[2];
            if (dataType === page ) {
                return "activePage";
            }else{
                return "deactivePage";
            }
        }
    }

    /***
     * get the page type from url, result/appendix/job/index
     ***/

    getPageType(page: string): string {
        let currentUrl = this.router.routerState.snapshot.url;
        let pageName = null;
        let patern = /\/(\w+)\/(\w+)/g;
        let a = patern.exec(currentUrl);
        if (a) {
            pageName = a[2];

            if (pageName == 'low_conf' || pageName =="high_conf" || pageName == "new_id"){
                return "result";
            }


            if (pageName == "cluster_details"){
                return "appendix";
            }

            if(pageName == "job_progress") {
                return "job";
            }

            if(pageName == "help") {
                return "help";
            }

        }
        patern = /\/(\w+)/g;
        a = patern.exec(currentUrl);
        if (a) {
            pageName = a[1];
            if (pageName== 'index' ) {
                return "index";
            }else{
                return null;
            }
        }

        return null;
    }

}
