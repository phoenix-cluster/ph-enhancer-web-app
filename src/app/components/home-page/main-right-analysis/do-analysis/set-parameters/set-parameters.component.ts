import {Component, Input, OnInit} from '@angular/core';
import {environment} from "../../../../../../environments/environment";
import {DoAnalysisService} from "../../../../../services/do-analysis.service";
import {AnalysisDataService} from "../../../../../services/analysis-data.service";
import {ConfigService} from "../../../../../services/config.service";
import {Router} from "@angular/router";
import {_catch} from "rxjs/operator/catch";
import {AnalysisJob} from "../../../../../model/analysisJob";
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

    constructor(private router: Router, private  doAnalysisService: DoAnalysisService, private analysisData:AnalysisDataService,
                private configService:ConfigService) {
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
    }

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

}
