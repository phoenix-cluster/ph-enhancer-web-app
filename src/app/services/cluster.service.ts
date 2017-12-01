import {Injectable} from "@angular/core";
import {Psm} from "../models/psm";
import {Headers, Http} from "@angular/http";

import 'rxjs/add/operator/toPromise'
import {Cluster} from "../models/cluster";
import {Config} from "../models/config";

@Injectable()

export class ClusterService {

    private baseUrl = Config.baseUrl;
    private headers = new Headers({'Content-type': 'application/json'});

    constructor(private http: Http) {
    }

    public getACluster(clusterid: string): Promise<Cluster> {
        let clusterUrl = this.baseUrl + "clusters/"
            + clusterid;

        return this.http.get(clusterUrl)
            .toPromise()
            //to do the map here!
            .then(response => response.json() as Cluster)
            .catch(this.handleError);
    }

    getPsmTitleList(listLen: number): Promise<string[]> {
        return this.http.get(this.baseUrl)
            .toPromise()
            .then(response => {
                let strs: string[] = response.json().data as string[];
                return strs.slice(0, listLen)
            })
            .catch(this.handleError);
    }

    // getPsm(id: number): Promise<Psm>{
    // const url = `${this.psmsUrl}/${id}`;
    // return this.http.get(url)
    //   .toPromise()
    //   .then(response => response.json().data as Psm)
    //   .catch(this.handleError);
    // }

    private handleError(error: any): Promise<any> {
        console.log('A error occurred', error);
        return Promise.reject(error.message || error);
    }


}
