import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, ResponseContentType} from "@angular/http";

import 'rxjs/add/operator/toPromise'
import {environment} from "../../environments/environment";
import {ResultFileList} from "../model/resultFileList";
import {AnalysisJob} from "../model/analysisJob";
import {Observable} from "rxjs/Observable";
import {ConfigService} from "./config.service";

@Injectable()

export class FileUploadService {

    private applyJobUrl:string;
    private analysisBaseUrl:string;
    private confirmFilesUrl:string;
    private headers = new Headers({'Content-type': 'application/json'});

    constructor(private http: Http,
    private configService: ConfigService) {

        this.configService.getConfig().then((configJson) => {
            this.applyJobUrl = configJson.baseUrl +  "analysis/apply"
            this.analysisBaseUrl = configJson.analysisBaseUrl;
            this.confirmFilesUrl = this.analysisBaseUrl+ "file/confirm"
        });
    }

    apply_an_analysis_job(): Promise<AnalysisJob> {
        return this.http.get(this.applyJobUrl)
            .toPromise()
            .then(response => {
                let analysisJob:AnalysisJob = response.json() as AnalysisJob;
                return analysisJob;
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.log('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    conform_files(resultFileList: ResultFileList, analysisId:number): Promise<String> {
        const params = new URLSearchParams();
        let headers = new Headers();
        headers.append('analysisId', String(analysisId))

        const options = new RequestOptions({
            headers: headers,
            responseType: ResponseContentType.Json,
            params: params,
            withCredentials: false
        });

        console.log('Options: ' + JSON.stringify(options));


        return this.http.post(this.confirmFilesUrl, resultFileList, options)
            .toPromise()
            .then(response => {
                let status: string = response.text();
                return status;
            })
            .catch(this.handleError);
    }



}
