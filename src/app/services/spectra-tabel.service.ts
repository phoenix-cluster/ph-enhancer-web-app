import { Injectable } from "@angular/core";
import { Spectrum } from "../models/spectrum";
import { Headers, Http } from "@angular/http";

import 'rxjs/add/operator/toPromise'

@Injectable()

export class SpectrumTableService{

  private spectraUrl = 'api/spectra';
  private spectraTitleListUrl = 'api/spectrumTitleList';
  private headers = new Headers({'Content-type': 'application/json'});

  constructor(private http: Http){}

	getSpectra(): Promise<Spectrum[]>{
    return this.http.get(this.spectraUrl)
      .toPromise()
      .then(response => response.json().data as Spectrum[])
      .catch(this.handleError);
	}

    getSpectraTitleList(listLen:number): Promise<string[]>{
    return this.http.get(this.spectraTitleListUrl)
      .toPromise()
      .then(response => {let strs:string[] = response.json().data as string[]; console.log(strs.slice(0, listLen));return strs.slice(0, listLen)})
      .catch(this.handleError);
	}
	// getSpectrum(id: number): Promise<Spectrum>{
    // const url = `${this.spectraUrl}/${id}`;
    // return this.http.get(url)
    //   .toPromise()
    //   .then(response => response.json().data as Spectrum)
    //   .catch(this.handleError);
    // }

  private handleError(error: any): Promise<any> {
    console.log('A error occurred', error);
    return Promise.reject(error.message || error);
  }


}
