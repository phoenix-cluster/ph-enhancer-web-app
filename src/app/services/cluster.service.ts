import {Injectable} from "@angular/core";
import {Psm} from "../model/psm";
import {Headers, Http} from "@angular/http";

import 'rxjs/add/operator/toPromise'
import {Cluster} from "../model/cluster";
import {ConfigService} from "../services/config.service";
import {LocalStorageService} from "./local-storage.service";

@Injectable()

export class ClusterService {

    private headers = new Headers({'Content-type': 'application/json'});
    private clusterUrl: string;

    constructor(private http: Http, private localStorageService: LocalStorageService,
                private configService: ConfigService) {
    }

    public getACluster(clusterid: string): Promise<Cluster> {
        let cluster = this.localStorageService.getData("cluster_" + clusterid);
        if(cluster != null) {
            return new Promise(resolve => resolve(cluster));
        }else {
            return this.configService.getConfig().then((configJson) =>
            {
                this.clusterUrl = configJson.clusterBaseUrl+ "clusters/"
                    + clusterid;
                return this.http.get(this.clusterUrl)
                    .toPromise()
                    //     to do the map here!
                    .then(response => {
                        let newCluster: Cluster = response.json();
                        this.localStorageService.setData("cluster_" + clusterid, newCluster);
                        return newCluster;
                    })
                    .catch(this.handleError);
            });
        }
    }

    getPsmTitleList(listLen: number): Promise<string[]> {
        return this.configService.getConfig().then(configJson => {
                return this.http.get(configJson.clusterBaseUrl)
                    .toPromise()
                    .then(response => {
                        let strs: string[] = response.json().data as string[];
                        return strs.slice(0, listLen)
                    })
                    .catch(this.handleError);
            });
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
