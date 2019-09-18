import {Injectable} from "@angular/core";
import {Headers, Http} from "@angular/http";
import {environment} from "../../environments/environment"
import {HistgramBin} from "../model/histogram-bin";
import {VennData} from "../model/vennData";
import {Thresholds} from "../model/thresholds";
import {ConfigService} from "../services/config.service";

// import 'rxjs/add/operator/toPromise';

@Injectable()

export class StatisticsService {

    private headers = new Headers({'Content-type': 'application/json'});

    constructor(private http: Http,
                private configService: ConfigService) {
    }

    public getHistData(identifier:string,psmType:string, fieldType: string, filterTaxid:string): Promise<HistgramBin[]> {
         return   this.configService.getConfig().then((configJson) => {
                let histDataUrl = configJson.baseUrl + "statistics/histogram?" +
                    "identifier=" + identifier +
                    "&numBins=" + "20" +
                    "&psmType=" + psmType +
                    "&fieldType=" + fieldType +
                    "&FilterBySpecies=" + filterTaxid;
                return this.http.get(histDataUrl)
                    .toPromise()
                    .then(response => {
                        if (response == null) {
                            return null;
                        }
                        ;
                        var histBins: HistgramBin[] = response.json() as HistgramBin[];
                        for (var i = 0; i < histBins.length; i++) {
                            // if (histBins[i].value == 0){
                            //     histBins.splice(i,1);
                            //     continue;
                            // }

                            if (fieldType === "confScore" || fieldType === "recommConfScore" || fieldType === "clusterRatio") {
                                histBins[i].name = Number(histBins[i].lowerBound).toFixed(3) + " - " + Number(histBins[i].upperBound).toFixed(3);
                            } else {
                                histBins[i].name = histBins[i].lowerBound + " - " + histBins[i].upperBound;
                            }
                        }
                        return histBins;
                    })
                    .catch(this.handleError);
            });
    }

    public getThresholds(identifier: string): Promise<Thresholds> {
        return    this.configService.getConfig().then((configJson) => {
                let dataUrl = configJson.baseUrl + "statistics/thresholds?" +
                    "identifier=" + identifier;
                return this.http.get(dataUrl)
                    .toPromise()
                    .then(response => {
                        var thresholds: Thresholds = response.json() as Thresholds;
                        return thresholds;
                    })
                    .catch(this.handleError);
            });
    }

    public getVennData(identifier: string): Promise<VennData> {
        return    this.configService.getConfig().then((configJson) => {
                let dataUrl = configJson.baseUrl + "statistics/venndata?" +
                    "identifier=" + identifier;
                return this.http.get(dataUrl)
                    .toPromise()
                    .then(response => {
                        var vennData: VennData = response.json() as VennData;
                        return vennData;
                    })
                    .catch(this.handleError);
            });
    }

    public getVennDataList(): Promise<VennData[]> {
        return this.configService.getConfig().then((configJson) => {
                let dataUrl = configJson.baseUrl + "statistics/venndatalist"
                return this.http.get(dataUrl)
                    .toPromise()
                    .then(response => {
                        var vennDataList: VennData[] = response.json() as VennData[];
                        return vennDataList;
                    })
                    .catch(this.handleError);
            });
    }


    public getProjects(): Promise<string[]> {
        return    this.configService.getConfig().then((configJson) => {
                let dataUrl = configJson.baseUrl + "statistics/projects";
                return this.http.get(dataUrl)
                    .toPromise()
                    .then(response => {
                        var projects: string[] = response.json() as string[];
                        return projects;
                    })
                    .catch(this.handleError);
            });
    }


    private handleError(error: any): Promise<any> {
        console.log('A error occurred', error);
        return Promise.reject(error.message || error);
    }


}
