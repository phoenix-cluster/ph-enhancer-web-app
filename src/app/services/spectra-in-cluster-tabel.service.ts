import {Injectable} from "@angular/core";
import {SpectrumInCluster} from "../models/spectrum-in-cluster";
import {Headers, Http} from "@angular/http";

// import 'rxjs/add/operator/toPromise';

@Injectable()

export class SpectrumInClusterTableService {

    private baseUrl = 'http://localhost:8090/example/v1/';
    private headers = new Headers({'Content-type': 'application/json'});

    constructor(private http: Http) {
    }

    getSpectra(titlesStr: string): Promise<SpectrumInCluster[]> {
        let spectraUrl = this.baseUrl.concat("spectrumInCluster/titles/", encodeURIComponent(titlesStr));
        // let spectraUrl = this.baseUrl.concat("spectrumInCluster/", encodeURIComponent(titlesStr));
        console.log(spectraUrl);
        return this.http.get(spectraUrl)
            .toPromise()
            .then(response => response.json() as SpectrumInCluster[])
            .catch(this.handleError);
    }

    // getSpectraTitleList(listLen: number): Promise<string[]> {
    //     return this.http.get(this.spectraTitleListUrl)
    //         .toPromise()
    //         .then(response => {
    //             let strs: string[] = response.json().data as string[];
    //             console.log(strs.slice(0, listLen));
    //             return strs.slice(0, listLen)
    //         })
    //         .catch(this.handleError);
    // }

    getSpectrumInCluster(titleStr: string): Promise<SpectrumInCluster> {
        let spectrumInClusterUrl = this.baseUrl.concat("spectrumInCluster/", encodeURIComponent(titleStr));
        return this.http.get(spectrumInClusterUrl)
            .toPromise()
            .then(response => response.json().data as SpectrumInCluster)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.log('A error occurred', error);
        return Promise.reject(error.message || error);
    }


}
