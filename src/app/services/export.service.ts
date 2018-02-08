import {Injectable} from "@angular/core";
import {Psm} from "../model/psm";
import {Headers, Http} from "@angular/http";

import 'rxjs/add/operator/toPromise'
import {Cluster} from "../model/cluster";
import {Config} from "../model/config";
import {LocalStorageService} from "./local-storage.service";
import 'rxjs/add/operator/map'
import {ExportConfig} from "../model/export-config";

@Injectable()

export class ExportService {

    private baseUrl = Config.baseUrl;
    private headers = new Headers({'Content-type': 'application/json'});

    constructor(private http: Http) {
    }

    public setExport(projectId: string, exportConfig : ExportConfig): Promise<String> {
        let exportUrl = this.baseUrl + "export?";
        exportUrl += "projectId=" + projectId;
        if (exportConfig.newIdent)
            exportUrl += "&newIdentScRange=[" + exportConfig.newIdentStart + "," + exportConfig.newIdentEnd + "]";
        if (exportConfig.highConf)
            exportUrl += "&highConfScRange=[" + exportConfig.highConfStart + ","+ exportConfig.highConfEnd + "]";
        if (exportConfig.recommBetter)
            exportUrl += "&recommendRange=[" + exportConfig.recommBetterStart + ","+ exportConfig.recommBetterEnd+ "]";

        exportUrl += "&hasAccept=" + exportConfig.hasAccpeted;
        exportUrl += "&defaultAcceptType=" + exportConfig.defaultAccpetType;
        exportUrl += "&hasRejected=" + exportConfig.hasRejected;
        // this.headers['exportParams'] = exportParams;

        return this.http.get(exportUrl)
                .toPromise()
                //     to do the map here!
                .then(response => {
                    let obj = response.json();
                    let filepath: string = obj.filePath;
                    let downloadurl = Config.baseUrl + "file/download?filepath=" + filepath;
                    return downloadurl;
                })
                .catch(this.handleError);
    }

    downloadfile(filepath: string){
        var headers = new Headers();
        headers.append('responseType', 'json');
        return this.http.get( filepath)
            .map(res => new Blob([res],{ type: 'application/json' }));
    }

    private handleError(error: any): Promise<any> {
        console.log('A error occurred', error);
        return Promise.reject(error.message || error);
    }


}