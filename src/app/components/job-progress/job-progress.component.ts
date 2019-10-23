import {Component, OnDestroy, OnInit} from '@angular/core';
import {DoAnalysisService} from '../../services/do-analysis.service';
import {AnalysisJob} from "../../model/analysisJob";
import {NavigationEnd, Router} from "@angular/router";

import {Observable} from "rxjs/Observable";
import {AnonymousSubscription} from "rxjs/Subscription";
import {PageOfLogFile} from "../../model/pageOfLogFile";
import {appendNgContent} from "@angular/core/src/view/ng_content";

@Component({
    selector: 'app-job-progress',
    templateUrl: './job-progress.component.html',
    styleUrls: ['./job-progress.component.scss']
})
export class JobProgressComponent implements OnInit, OnDestroy {
    private timerSubscription: AnonymousSubscription;
    private postsSubscription: AnonymousSubscription;

    private timerSubscription2: AnonymousSubscription;
    private postsSubscription2: AnonymousSubscription;

    token: string;
    analysisJob: AnalysisJob;
    currentPageOfLog: PageOfLogFile = new PageOfLogFile([], 0, 0, 0);

    constructor(private doAnalysisService: DoAnalysisService, private router: Router) {
    }

    ngOnInit() {
        this.token = this.getTokenFromUrl();
        console.log(this.token)
        this.refreshData(this.token);
        this.refreshData2(this.token);
        // this.fileuploadService.get_analysis_job_by_token(this.token).subscribe(
        //     analysisJob => {
        //         this.analysisJob = analysisJob;
        //     }
        // );
    }

    ngOnDestroy(): void {
        if (this.postsSubscription) {
            this.postsSubscription.unsubscribe();
        }
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
        if (this.postsSubscription2) {
            this.postsSubscription2.unsubscribe();
        }
        if (this.timerSubscription2) {
            this.timerSubscription2.unsubscribe();
        }
    }

    getTokenFromUrl(): string {
        let currentUrl = this.router.routerState.snapshot.url;
        let patern = /\/(job_progress)\/(\w+)/g;
        let a = patern.exec(currentUrl);
        if (a) {
            console.log(a);
            let token: string = a[2];
            if (token.length != 10) {
                console.log("this token" + token + " is not char(10)");
            }
            return token;
        }
        else {
            alert("some thing is wrong here, the url is not like /job_progress/****** ");
            return null;
        }
    }

    private refreshData(token): void {
        this.postsSubscription = this.doAnalysisService.get_analysis_job_by_token(token).subscribe(analysisJob => {
            this.analysisJob = analysisJob;
            if (this.analysisJob.status != "finished") {
                this.subscribeToData(token);
            }

        });

    }

    private refreshData2(token): void {
        this.postsSubscription2 = this.doAnalysisService.get_page_of_log_by_token(token, this.currentPageOfLog.endLineNo + 1).subscribe(pageOfLog => {
            this.appendToCurrentPage(pageOfLog);
            console.log(pageOfLog);
            if (pageOfLog.length != -1) { //all data have been downloaded
                this.subscribeToData2(token);
            }
        }, error2 => {
            console.log("ERROR: " + error2);
            if (this.postsSubscription2) {
                console.log("postsSubscription2.unsubscribe()")
                this.postsSubscription2.unsubscribe();
            }
            if (this.timerSubscription2) {
                console.log("timerSubscription2.unsubscribe()")
                this.timerSubscription2.unsubscribe();
            }
        });
    }


    //
    private subscribeToData(token): void {
        this.timerSubscription = Observable.timer(50000).first().subscribe(() => this.refreshData(token));
    }

    private subscribeToData2(token): void {
        this.timerSubscription2 = Observable.timer(50000).first().subscribe(() => this.refreshData2(token));
    }

    private appendToCurrentPage(pageOfLog: PageOfLogFile): void {
        this.currentPageOfLog.lines = this.currentPageOfLog.lines.concat(pageOfLog.lines);
        this.currentPageOfLog.endLineNo = pageOfLog.endLineNo;
        this.currentPageOfLog.length = this.currentPageOfLog.length + pageOfLog.length;
    }
}
