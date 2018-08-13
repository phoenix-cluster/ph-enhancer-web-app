import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, ResponseContentType} from "@angular/http";

import 'rxjs/add/operator/toPromise'
import {Config} from "../model/config";

@Injectable()

export class DoAnalysisService{

    private baseUrl = Config.baseUrl;
    private doAanlysisUrl :string = this.baseUrl + "analysis/do";
    private headers = new Headers({'Content-type': 'application/json'});

    constructor(private http: Http) {
    }


    public do_analysis(analysis_job_id:number, min_cluster_size:number): Promise<string> {
        const params = new URLSearchParams();
        let headers = new Headers({'Content-type': 'application/json'});
        headers.append('analysisId', String(analysis_job_id));
        headers.append('minClusterSize', String(min_cluster_size));

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
}