import {Component, OnInit} from '@angular/core';
import {Config} from "../../../../model/config";
import {Router} from "@angular/router";
import {StatisticsService} from "../../../../services/statistics.service";

@Component({
    selector: 'app-check-examples',
    templateUrl: './check-examples.component.html',
    styleUrls: ['./check-examples.component.scss']
})
export class CheckExamplesComponent implements OnInit {

    constructor(private router: Router, private statisticsService: StatisticsService) {
    }

    colorSelect: Array<any>;


    projects = [Config.defaultProject];
    selectedProject = Config.defaultProject;

    ngOnInit() {
        this.getAndSetProjects();
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
