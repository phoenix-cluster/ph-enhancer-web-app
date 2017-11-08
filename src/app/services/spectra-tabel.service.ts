import {Injectable} from "@angular/core";
import {Spectrum} from "../models/spectrum";
import {Headers, Http} from "@angular/http";

// import 'rxjs/add/operator/toPromise';

@Injectable()

export class SpectrumTableService {

    private baseUrl = 'http://localhost:8090/example/v1/';
    private headers = new Headers({'Content-type': 'application/json'});

    constructor(private http: Http) {
    }

    getSpectra(titlesStr: string): Promise<Spectrum[]> {
        let spectraUrl = this.baseUrl.concat("spectrum/titles/", encodeURIComponent(titlesStr));
        // let spectraUrl = this.baseUrl.concat("spectrum/", encodeURIComponent(titlesStr));
        console.log(spectraUrl);
        return this.http.get(spectraUrl)
            .toPromise()
            .then(response => response.json() as Spectrum[])
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

    getSpectrum(titleStr: string): Promise<Spectrum> {
        let spectrumUrl = this.baseUrl.concat("spectrum/", encodeURIComponent(titleStr));
        return this.http.get(spectrumUrl)
            .toPromise()
            .then(response => response.json().data as Spectrum)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.log('A error occurred', error);
        return Promise.reject(error.message || error);
    }


}
