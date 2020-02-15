import {Component, OnDestroy, Input, OnInit} from '@angular/core';
import {environment} from "../../../../../../environments/environment";
import {DoAnalysisService} from "../../../../../services/do-analysis.service";
import {AnalysisDataService} from "../../../../../services/analysis-data.service";
import {ConfigService} from "../../../../../services/config.service";
import {Router} from "@angular/router";
import {_catch} from "rxjs/operator/catch";
import {AnalysisJob} from "../../../../../model/analysisJob";
import {AnonymousSubscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import {CheckExamplesService} from "../../../../../services/checkExams/check-examples.service";
// import { NG_VALIDATORS,Validator, Validators,AbstractControl,ValidatorFn } from '@angular/forms';

@Component({
    selector: 'app-set-parameters',
    templateUrl: './set-parameters.component.html',
    styleUrls: ['./set-parameters.component.scss']
})
export class SetParametersComponent implements OnInit {
    analysisJobId:number;
    analysisJob:AnalysisJob;
    analysisJobToken:string;
    analysisEnabled:boolean;
    fileUploadEnabled:boolean;
    userEmailAdd:string;
    makeResultsPublic:boolean = false;
    public minClusterSize:number ;


    private timerSubscription: AnonymousSubscription;
    private postsSubscription: AnonymousSubscription;

    constructor(private router: Router, private  doAnalysisService: DoAnalysisService, private analysisData:AnalysisDataService,
                private configService:ConfigService, public checkExamService: CheckExamplesService) {
    }

    ngOnInit() {
        this.analysisData.currentAnalysisJob.subscribe(analysisJob => {this.analysisJob = analysisJob;
            if(this.analysisJob != null) {
                this.analysisJobId = analysisJob.id
            }});
        this.analysisData.currentAnalysisToken.subscribe(analysisToken => this.analysisJobToken = analysisToken);
        this.analysisData.currentAnalysisEnabled.subscribe(analysisEnabled=> this.analysisEnabled = analysisEnabled);
        this.analysisData.currentFileUploadEnabled.subscribe(fileUploadEnabled=> this.fileUploadEnabled= fileUploadEnabled);
        this.configService.getConfig().then(configJson => {
                this.minClusterSize = configJson.defaultMinClusterSize;
            }
        )
        // console.log(this.analysisJobToken);
        // if(this.analysisJobToken == null || this.analysisJobToken.length < 1){
        //     this.analysisJobToken = "nulltokenn";
        //     console.log(this.analysisJobToken);
        // }
        // this.refreshData(this.analysisJobToken);

    }

    // ngOnDestroy(): void {
    //     if (this.postsSubscription) {
    //         this.postsSubscription.unsubscribe();
    //     }
    //     if (this.timerSubscription) {
    //         this.timerSubscription.unsubscribe();
    //     }
    // }



    doAnalysis() {

        if(this.analysisJobId == null || this.analysisJobId <= 0){
            alert("Please upload your files firstly");
            return;
        }

        if(this.fileUploadEnabled){
            console.log(this.analysisJobId);
            alert("Please confirm your files in uploading component.");
            return;
        }
        // console.log(this.isEmailValidated(this.userEmailAdd));
        if(this.userEmailAdd == null || !this.isEmailValidated(this.userEmailAdd)){
            alert("Please input a validated email address");
            return;
        }

        let publicFlag = "PUBLIC";
        if(!this.makeResultsPublic) {
            publicFlag = "UNPUBLIC"
        }
        let message = "Start to analysis " + publicFlag +
            " job:" +this.analysisJobId+ " with cluster Size "+ this.minClusterSize;
        alert(message);

        this.analysisEnabled = false;
        this.analysisData.changeAnalysisEnabled(false);
        this.router.navigateByUrl("job_progress/" + this.analysisJobToken).then(_ =>{console.log("route changed to job_progress")});
        this.doAnalysisService.do_analysis(this.analysisJobId, this.minClusterSize, this.userEmailAdd, this.makeResultsPublic).then(
            response=>{
                console.log(response);
            }
        )
    }

    onMinClusterSizeChange(event) {
        this.minClusterSize = event;
    }

    onUserEmailAddChange(event){
        this.userEmailAdd = event;
    }


    checkJobProgress(){
        if(this.analysisJobToken.length != 10){
            alert("The analysis job token is not char(10)");
            return;
        }

        this.router.navigateByUrl("job_progress/" + this.analysisJobToken).then(_ =>{console.log("route changed to job_progress")});
    }

    checkJobResult(){
        if(this.analysisJobToken.length != 10){
            alert("The analysis job token is not char(10)");
            return;
        }

        this.router.navigateByUrl(this.analysisJobToken + "/low_conf" ).then(_ =>{
            this.checkExamService.projectId.id = this.analysisJobToken
            console.log("route changed to low_conf")
        });
    }


    refreshPage(){
        location.reload();
    }

    isEmailValidated(emailAdd:string):boolean{
        let pattern= new RegExp("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$");
        if(emailAdd.match(pattern) != null){
            return true;
        }
        else{
            return false;
        }
    }


    onMakePublicCheck(){
        this.makeResultsPublic = !this.makeResultsPublic;
        console.log(this.makeResultsPublic);
    }

    // private subscribeToData(token): void {
    //     this.timerSubscription = Observable.timer(50000).first().subscribe(() => this.refreshData(token));
    // }


    // private refreshData(token): void {
    //     this.postsSubscription = this.doAnalysisService.get_analysis_job_by_token(token).subscribe(analysisJob => {
    //         this.analysisJob = analysisJob;
    //         if (this.analysisJob.status != "finished") {
    //             this.subscribeToData(token);
    //         }
    //     });

    // }



}
