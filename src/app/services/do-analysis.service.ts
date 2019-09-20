import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, ResponseContentType} from "@angular/http";

import 'rxjs/add/operator/toPromise'
import {environment} from "../../environments/environment"

import {Observable} from "rxjs/Observable";
import {AnalysisJob} from "../model/analysisJob";
import {PageOfLogFile} from "../model/pageOfLogFile";
import {map} from "rxjs/operator/map";
import {ConfigService} from "../services/config.service";

@Injectable()
export class DoAnalysisService{
    private doAanlysisUrl:string;
    private getJobByTokenUrl: string;
    private getPageOfLogByTokenUrl : string;
    private headers = new Headers({'Content-type': 'application/json'});

    constructor(private http: Http, private configService:ConfigService) {

        this.configService.getConfig().then(configJson => {
            this.doAanlysisUrl = configJson.analysisBaseUrl + "analysis/do";
            this.getJobByTokenUrl = configJson.baseUrl + "/" + "analysis/getAnalysisJobByToken?"
            this.getPageOfLogByTokenUrl = configJson.baseUrl + "/" + "analysis/getPageOfLogByToken?";
        });
    }


    public do_analysis(analysis_job_id:number, min_cluster_size:number, userEmailAdd:string, isPublic:boolean): Promise<string> {
        const params = new URLSearchParams();
        let headers = new Headers({'Content-type': 'application/json'});
        headers.append('analysisId', String(analysis_job_id));
        headers.append('minClusterSize', String(min_cluster_size));
        headers.append('userEmailAdd', String(userEmailAdd));
        headers.append('isPublic', String(isPublic));

        const options = new RequestOptions({
            headers: headers,
            responseType: ResponseContentType.Json,
            params: params,
            withCredentials: false
        });

        return this.http.post(this.doAanlysisUrl, null, options)
                    .toPromise()
                    .then(response => {
                        let status: string = response.text();
                        return status;
                    })
                    .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.log('A error occurred', error);
        return Promise.reject(error.message || error);
    }


    get_analysis_job_by_token(token:string): Observable<AnalysisJob> {
        if(token == null || token.length != 10){
            return null;
        }

            return this.http.get(this.getJobByTokenUrl + "token=" + token)
                .map(response => response.json())
                .catch(this.handleError);
    }

    get_page_of_log_by_token(token:string, startLineNo:number): Observable<PageOfLogFile> {
        if(token == null || token.length != 10){
            return null;
        }

            return this.http.get(this.getPageOfLogByTokenUrl + "token=" + token + "&startLineNo=" + startLineNo)
                .map(response => response.json())
                ;
    }

}