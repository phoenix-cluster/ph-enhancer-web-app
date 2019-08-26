import {Component, OnInit} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {Router} from "@angular/router";
import {StatisticsService} from "../../../../services/statistics.service";
import {ConfigService} from "../../../../services/config.service";

@Component({
    selector: 'app-check-examples',
    templateUrl: './check-examples.component.html',
    styleUrls: ['./check-examples.component.scss']
})
export class CheckExamplesComponent implements OnInit {

    constructor(private router: Router, private statisticsService: StatisticsService,
                private configService:ConfigService) {
    }

    colorSelect: Array<any>;


    projects : string[];
    selectedProject :string;

    ngOnInit() {
        this.configService.getConfig().then((configJson) => {
            this.projects = [configJson.defaultProject];
            this.selectedProject = configJson.defaultProject;
            this.getAndSetProjects();
        });
    }

    onChange(event){
        this.selectedProject = event;
        let psmTableType = "low_conf"
        let projectId = this.selectedProject;
        this.router.navigateByUrl('' + psmTableType + "/" + projectId).then(_ =>{console.log("route changed")});
    }
    private getAndSetProjects() {
        this.statisticsService.getProjects()
            .then(projects => {
                this.projects = projects;
            }).catch(this.handleError);
    }
    private handleError(error: any): void {
        console.log('A error occurred', error);
    }
}
