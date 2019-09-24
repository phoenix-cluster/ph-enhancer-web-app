import {Component, OnInit, OnDestroy} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {Router} from "@angular/router";
import {StatisticsService} from "../../../../services/statistics.service";
import {ConfigService} from "../../../../services/config.service";
import {CheckExamplesService} from "../../../../services/checkExams/check-examples.service";

@Component({
    selector: 'app-check-examples',
    templateUrl: './check-examples.component.html',
    styleUrls: ['./check-examples.component.scss']
})
export class CheckExamplesComponent implements OnInit, OnDestroy {
    constructor(private router: Router, private statisticsService: StatisticsService,
                private configService:ConfigService, public checkExamService: CheckExamplesService) {
    }

    colorSelect: Array<any>;
    projects : string[];
    public selectedProject :string;

    ngOnInit() {
        this.configService.getConfig().then((configJson) => {
            this.projects = [configJson.defaultProject];
            this.selectedProject = configJson.defaultProject;
            this.getAndSetProjects();
        });
    }
    ngOnDestroy() {
        this.checkExamService.idEventer.emit(this.checkExamService.projectId)
    }
    onChange(event){
        this.selectedProject = event;
        let psmTableType = "low_conf"
        let projectId = this.selectedProject;
        this.checkExamService.projectId.id = event
        this.router.navigateByUrl('' + projectId  + "/" + psmTableType).then(_ =>{});
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
