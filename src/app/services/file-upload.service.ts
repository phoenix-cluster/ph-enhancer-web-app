import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, ResponseContentType} from "@angular/http";

import 'rxjs/add/operator/toPromise'
import {Config} from "../model/config";
import {ResultFileList} from "../model/resultFileList";
import {AnalysisJob} from "../model/analysisJob";

@Injectable()

export class FileUploadService {

    private baseUrl = Config.baseUrl;
    private getidUrl = this.baseUrl + "/" + "file/apply"
    private confirmFilesUrl = this.baseUrl + "/" + "file/confirmFiles"
    private headers = new Headers({'Content-type': 'application/json'});

    constructor(private http: Http) {
    }

    apply_an_analysis_job(): Promise<AnalysisJob> {
        return this.http.get(this.getidUrl)
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

    conform_files(resultFileList: ResultFileList, myId:number): Promise<String> {
        const params = new URLSearchParams();
        let headers = new Headers();
        headers.append('myId', String(myId))

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
