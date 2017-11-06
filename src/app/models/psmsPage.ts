import {Psm} from "./psm";

export class PSMsPage{
    private pageSize:number;
    private page:number;
    public totalElements:number;
    public totalPages:number;
    private sortFields:String;
    private sortDirection:String;
    public scoredPSMs:Psm[];


    // get psms(): Psm[] {
    //     return this._scoredPSMs;
    // }

}