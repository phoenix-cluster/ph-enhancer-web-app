import {Injectable} from "@angular/core";
import {SpectrumInCluster} from "../models/spectrum-in-cluster";
import {Headers, Http} from "@angular/http";
import {Config} from "../models/config"
import {Spectrum} from "../models/spectrum";
import {LocalStorageService} from "./local-storage.service";

// import 'rxjs/add/operator/toPromise';

@Injectable()

export class SpectrumService {

    private baseUrl = Config.baseUrl;
    private headers = new Headers({'Content-type': 'application/json'});

    constructor(private http: Http,
                private localStorageService: LocalStorageService) {
    }

    public getSpectra(titlesStr: string): Promise<Spectrum[]> {
        let spectraUrl = this.baseUrl.concat("spectrum/titles/", encodeURIComponent(titlesStr));
        let spectra = this.localStorageService.getData("spectra_" + titlesStr);
        if(spectra != null) {
            return new Promise(resolve => resolve(spectra));
        }else {
            return this.http.get(spectraUrl)
                .toPromise()
                .then(response => {
                    let spectra: Spectrum[] = response.json() as Spectrum[];
                    this.localStorageService.setData("spectra_" +titlesStr, spectra);
                    return spectra
                })
                .catch(this.handleError);
        }
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
        let spectrumInClusterUrl = this.baseUrl.concat("spectrum/", encodeURIComponent(titleStr));
        let spectrum = this.localStorageService.getData("spectrum_" + titleStr);
        if(spectrum != null) {
            return new Promise(resolve => resolve(spectrum));
        }else {
            return this.http.get(spectrumInClusterUrl)
                .toPromise()
                .then(response => {
                    let spectrum:Spectrum = response.json().data as Spectrum;
                    this.localStorageService.setData("spectrum_" +titleStr, spectrum);
                    return spectrum;
                })
                .catch(this.handleError);
        }
    }

    private handleError(error: any): Promise<any> {
        console.log('A error occurred', error);
        return Promise.reject(error.message || error);
    }


}
