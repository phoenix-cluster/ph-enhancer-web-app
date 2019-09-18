import {Injectable} from "@angular/core";
import {Psm} from "../model/psm";
import {Headers, Http} from "@angular/http";

import 'rxjs/add/operator/toPromise'
import {Observable} from 'rxjs/Observable';
import {Cluster} from "../model/cluster";
import {environment} from "../../environments/environment";
import {LocalStorageService} from "./local-storage.service";

@Injectable()

export class ConfigService{

    private configFilePath = environment.configFilePath;
    private config:any = null;

    constructor(private http: Http) {
    }

    public getConfig(): Promise<any> {
        if (this.config != null){
            return new Promise(resolve => resolve(this.config));
        }
        return this.http.get(this.configFilePath)
            .toPromise()
            .then(res => {
                this.config = res.json();
                return this.config;
            });
    }

    private handleError(error: any): Promise<any> {
        console.log('A error occurred', error);
        return Promise.reject(error.message || error);
    }


}
