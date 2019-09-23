import {Psm} from "./psm";
import {Page} from "./page";

export class PSMsPage{
    pageSize:number;
    page:number;
    totalElements:number;
    totalPages:number;
    sortFields:String;
    sortDirection:String;
    scoredPSMs:Psm[];


    // get psms(): Psm[] {
    //     return this._scoredPSMs;
    // }

}