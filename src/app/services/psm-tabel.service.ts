import { Injectable } from "@angular/core";
import {Headers, Http, Response, RequestOptions} from "@angular/http";

import 'rxjs/add/operator/toPromise'
import {PSMsPage} from "../model/psmsPage";
import {environment} from "../../environments/environment";
import {Page} from "../model/page";
import {PagedData} from "../model/paged-data";
import {Psm} from "../model/psm";
import {ConfigService} from "../services/config.service";
import {Observable} from 'rxjs/Observable';

@Injectable()

export class PsmTableService{

  private psmTitleListUrl = 'api/psmTitleList';
  private headers = new Headers({'Content-type': 'application/json', "Access-Control-Allow-Origin": "*" });

  constructor(private http: Http,
              private configService: ConfigService) {
              }

	// getPsms(): Promise<Psm[]>{
    // return this.http.get(this.psmsUrl)
     //  .toPromise()
     //  .then(response => response.json().data as Psm[])
     //  .catch(this.handleError);
	// }

    getPsmsPage(identifier:string, psmType:string, page:Page): Promise<PSMsPage>{
        // console.log(page);
        if(psmType == "newid" && page.sortField == "confidentScore"){
            page.sortField = "recommConfidentScore";
        }
        return this.configService.getConfig().then((configJson) => {
                let psmsUrl = configJson.baseUrl + "scoredpsms/" + psmType + "?"
                    + "identifier=" + identifier
                    + "&page=" + page.pageNumber
                    + "&size=" + page.size
                    + "&sortField=" + page.sortField
                    + "&sortDirection=" + page.sortDirection
                    + "&FilterBySpecies=" + page.selectedSpeciesId;
                // console.log(psmsUrl);
                return this.http.get(psmsUrl)
                    .toPromise()
                    .then(response => response.json() as PSMsPage)
                    .catch(this.handleError);
        });

    }

    //
    // getNegPsmsPage(page:Page): Promise<PSMsPage>{
    //     console.log(page);
    //     let psmsUrl = this.baseUrl + "negscore?"
    //         + "page=" + page.pageNumber
    //         + "&size=" + page.size
    //         + "&sortField=" + page.sortField
    //         + "&sortDirection=" + page.sortDirection;
    //     console.log(psmsUrl);
    //     return this.http.get(psmsUrl)
    //         .toPromise()
    //         .then(response => response.json() as PSMsPage)
    //         .catch(this.handleError);
    // }
    //
    // getRecommIdPsmsPage(page:number, size:number, sortField:string, sortDirection:string): Promise<PSMsPage>{
    //     let psmsUrl = this.baseUrl + "recomm?"
    //         + "page=" + page
    //         + "&size=" + size
    //         + "&sortField=" + sortField
    //         + "&sortDirection=" + sortDirection;
    //
    //     console.log(psmsUrl);
    //     return this.http.get(psmsUrl)
    //         .toPromise()
    //         .then(response => response.json() as PSMsPage)
    //         .catch(this.handleError);
    // }
    //
    //
    // getPosPsmsPage(page:number, size:number, sortField:string, sortDirection:string): Promise<PSMsPage>{
    //     let psmsUrl = this.baseUrl + "posscore?"
    //         + "page=" + page
    //         + "&size=" + size
    //         + "&sortField=" + sortField
    //         + "&sortDirection=" + sortDirection;
    //     console.log(psmsUrl);
    //     return this.http.get(psmsUrl)
    //         .toPromise()
    //         .then(response => response.json() as PSMsPage)
    //         .catch(this.handleError);
    // }


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

    public uploadUserAcceptance(identifier:string, psmType:string, acceptanceMap:Map<number, number>):Promise<any> {
        return    this.configService.getConfig().then((configJson) => {
                let baseUrl = configJson.baseUrl + "scoredpsms/";
                let uploadUrl = baseUrl.concat("updateAcceptance?identifier=" + identifier + "&psmtype=" + psmType);
                let options = new RequestOptions({headers: this.headers});
                let mapKeys = acceptanceMap.keys();
                let jsonStr = "{";
                acceptanceMap.forEach((value: number, key: number) => {
                    jsonStr += "\"" + key + "\": \"" + value + "\",";
                });
                jsonStr = jsonStr.substr(0, jsonStr.length - 1) + "}";
                let body = jsonStr;
                return this.http.put(uploadUrl, body, options)
                    .toPromise()
                    .then(response => {
                        return response.json();
                    })
                    .catch(this.handleError);
            });
  }


  private handleError(error: any): Promise<any> {
    console.log('A error occurred', error);
    return Promise.reject(error.message || error);
  }


  getSpecies(identifier:string, scoreType:string): Promise<any> {
      return    this.configService.getConfig().then((configJson) => {
              let baseUrl = configJson.baseUrl + "scoredpsms/";
              let dataUrl = baseUrl + "species/?identifier=" + identifier + "&Score%20type=" + scoreType;
              return this.http.get(dataUrl)
                  .toPromise()
                  .then(response => {
                      var speciesList: string[] = response.json() as string[];
                      return speciesList;
                  })
                  .catch(this.handleError);
          });
  }
}
