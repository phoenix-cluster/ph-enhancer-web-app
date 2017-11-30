import { Injectable } from "@angular/core";
import { Psm } from "../models/psm";
import { Headers, Http } from "@angular/http";

import 'rxjs/add/operator/toPromise'
import {PSMsPage} from "../models/psmsPage";

@Injectable()

export class PsmTableService{

  private baseUrl = 'http://192.168.6.20:8090/example/v1/';
  private psmTitleListUrl = 'api/psmTitleList';
  private headers = new Headers({'Content-type': 'application/json'});

  constructor(private http: Http){}

	// getPsms(): Promise<Psm[]>{
    // return this.http.get(this.psmsUrl)
     //  .toPromise()
     //  .then(response => response.json().data as Psm[])
     //  .catch(this.handleError);
	// }

    getPsmsPage(page:number, size:number, sortField:string, sortDirection:string): Promise<PSMsPage>{
        let psmsUrl = this.baseUrl + "scoredpsms?"
            + "page=" + page
            + "&size=" + size
            + "&sortField=" + sortField
            + "&sortDirection=" + sortDirection;

        return this.http.get(psmsUrl)
            .toPromise()
            .then(response => response.json() as PSMsPage)
            .catch(this.handleError);
    }

    getPsmTitleList(listLen:number): Promise<string[]>{
    return this.http.get(this.psmTitleListUrl)
      .toPromise()
      .then(response => {let strs:string[] = response.json().data as string[]; return strs.slice(0, listLen)})
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
