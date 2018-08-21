import {Component, Input, OnInit} from '@angular/core';
import {Config} from "../../../../../model/config";
import {DoAnalysisService} from "../../../../../services/do-analysis.service";
import {AnalysisDataService} from "../../../../../services/analysis-data.service";
import {Router} from "@angular/router";
import {_catch} from "rxjs/operator/catch";
// import { NG_VALIDATORS,Validator, Validators,AbstractControl,ValidatorFn } from '@angular/forms';

@Component({
    selector: 'app-set-parameters',
    templateUrl: './set-parameters.component.html',
    styleUrls: ['./set-parameters.component.scss']
})
export class SetParametersComponent implements OnInit {
    analysisJobId:number;
    analysisJobToken:string;
    analysisEnabled:boolean;
    userEmailAdd:string;
    makeResultsPublic:boolean = false;
    public minClusterSize:number = Config.defaultMinClusterSize;

    constructor(private router: Router, private  doAnalysisService: DoAnalysisService, private analysisData:AnalysisDataService) {
    }

    ngOnInit() {
        this.analysisData.currentAnalysisId.subscribe(analysisId => this.analysisJobId = analysisId);
        this.analysisData.currentAnalysisToken.subscribe(analysisToken => this.analysisJobToken = analysisToken);
        this.analysisData.currentAnalysisEnabled.subscribe(analysisEnabled=> this.analysisEnabled = analysisEnabled);
    }

    doAnalysis() {
        if(this.analysisJobId <= 0){
            alert("Please upload your files firstly");
            return;
        }
        // console.log(this.isEmailValidated(this.userEmailAdd));
        if(!this.isEmailValidated(this.userEmailAdd)){
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

        this.doAnalysisService.do_analysis(this.analysisJobId, this.minClusterSize, this.userEmailAdd, this.makeResultsPublic).then(
            response=>{
                this.analysisEnabled = false;
                this.analysisData.changeAnalysisEnabled(false);
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
