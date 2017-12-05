import { Injectable } from '@angular/core';
@Injectable()
export class LocalStorageService {

    constructor() {
        //
    }

    public setData(key:string, data:any) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    public getData(key:string) {
        return JSON.parse(localStorage.getItem(key));
    }

    public removeData(key:string) {
        localStorage.removeItem(key);
    }
}