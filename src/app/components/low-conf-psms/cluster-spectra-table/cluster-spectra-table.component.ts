import {Component, OnInit} from '@angular/core';
import {Spectrum} from "../../../models/spectrum";
import {SpectrumTableService} from "../../../services/spectra-tabel.service";
import {ClusterService} from "../../../services/cluster.service";
import {Cluster} from "../../../models/cluster";
import {map} from "rxjs/operator/map";

@Component({
    selector: 'app-cluster-spectra-table',
    templateUrl: './cluster-spectra-table.component.html',
    styleUrls: ['./cluster-spectra-table.component.scss']
})
export class ClusterSpectraTableComponent implements OnInit {
    private spectrumHeaders = Spectrum.spectrumHeaders;
    private currentPage: number = 1;
    private currentSize: number = 10;
    private currentSortField = "confidentScore";
    private currentSortDirection = "DESC";
    private elemStart: number = (this.currentPage - 1) * this.currentSize + 1;
    private elemEnd: number = this.elemStart + this.currentSize - 1;
    private totalElem: number = 0;
    private totalPages: number = 0;
    private pages: number[];
    private sortByCol: string = "confidentScore"

    private currentClusterId: string = "";
    private allSpectraTitlesOfaCluster: string[];
    private currentSpectraTitles: string[];
    private currentCluster: Cluster;
    private currentSpectra: Spectrum[];


    constructor(private spectrumTableService: SpectrumTableService,
                private clusterService: ClusterService) {
    }

    // spectra : Spectrum[];
    // spectrumMap = new Map<string, Spectrum>();
    spectrumTitles: string[];
    spectrumTable = new Array<Spectrum>();

    getSpectra(): void {
        // this.spectrumTableService.getSpectra().then(spectra => {this.spectrumTable = spectra});
        // this.spectrumTableService.getSpectraTitleList(10).then(spectrumTitles => {this.spectrumTitles = spectrumTitles; this.writeSpectrumTable()});
    }

    ngOnInit() {
        // this.getSpectra();
        this.currentClusterId = "5045204c-2f1c-4c26-ab85-b22af50eeb19";
        this.rewriteSpectrumTable();
    }

    getClassByOrder(order: string): string {
        switch (order) {
            case 'False': {
                return '';
            }
            case 'asc': {
                return 'fa-sort-up';
            }
            case 'desc': {
                return 'fa-sort-down';
            }
        }
    }

    onAcceptClick(checkBoxId: string): void {
        let checkBox: HTMLInputElement = <HTMLInputElement> document.getElementById(checkBoxId);
        if (checkBox.readOnly) checkBox.checked = checkBox.readOnly = false;
    }

    setIndeterminate(checkBoxId: string): void {
        let checkBox: HTMLInputElement = <HTMLInputElement> document.getElementById(checkBoxId);
        checkBox.indeterminate = true;
    }

    /** write the table by search terms, pagenations, asec/dec ...
     *  based on the spectrumTitles, which comes from the server
     */
    // writeSpectrumTable():void{
    //   this.spectrumTable = [];
    //   for(var spectrumTitle of this.spectrumTitles){
    //     this.spectrumTable.push(this.spectrumMap.get(spectrumTitle))
    //   }
// }
//
//   rewriteSpectrumTablebyPageSize(pageSize:number):void{
//     alert(pageSize);
//     this.spectrumTableService.getSpectraTitleList(pageSize).then(spectrumTitles => {this.spectrumTitles = spectrumTitles; this.writeSpectrumTable()});
//   }

    // writeSpectrumTable(): void {
    //      this.spectrumTable = [];
    //      this.spectrumTitles = [];
    //      for (let entry of Array.from(this.spectrumMap.entries())) {
    //          this.spectrumTitles.push(entry[0]);
    //          this.spectrumTable.push(entry[1]);
    //      }
    //      ;
    //  }

    onPageSizeChange(size: string): void {
        this.currentSize = parseInt(size);
        this.currentPage = 1;
        this.rewriteSpectrumTable();
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.rewriteSpectrumTable();
    }

    rewriteSpectrumTable(): void {
        this.elemStart = (this.currentPage - 1) * this.currentSize + 1;
        this.elemEnd = (this.elemStart + this.currentSize) - 1;
        this.getAllSpectraTitlesAndSet();

        // this.getSpectraPage(this.currentPage, this.currentSize, this.currentSortField, this.currentSortDirection);
    }

    private setCurrentSpectra(): void {
        let titles = this.currentSpectraTitles.join("||");
        this.spectrumTableService.getSpectra(titles).then(spectra => {
            this.currentSpectra = spectra;
            //todo this.rePageSpectrumTable();
        })

    }

    private setCurrentSpectraTitles(): void {
        this.currentSpectraTitles = this.allSpectraTitlesOfaCluster.slice(this.elemStart - 1, this.elemEnd - 1);
    }

    private getAllSpectraTitlesAndSet(): void {
        // let cluster:Cluster = JSON.parse(localStorage.getItem(clusterId));
        // if (cluster == null){
        this.clusterService.getACluster(this.currentClusterId).then(cluster => {
            this.currentCluster = cluster;
            localStorage.setItem(cluster.id, JSON.stringify(cluster));
            this.allSpectraTitlesOfaCluster = cluster.spectraTitles;
            this.setCurrentSpectraTitles();
            this.setCurrentSpectra();
            this.setPages();
        });
        // }
    }

    onClickReSort(headItem): void {
        console.log(headItem);
        let index = this.spectrumHeaders.indexOf(headItem);
        if (headItem['order'] == 'asc') {
            this.spectrumHeaders[index]['order'] = 'desc';
        }
        else {
            this.spectrumHeaders[index]['order'] = 'asc';
        }
        this.sortByCol = this.spectrumHeaders[index]['headName'];
    }

    private setPages(): void {
        this.totalElem = this.allSpectraTitlesOfaCluster.length;
        this.totalPages = this.totalElem/this.currentSize + 1;
        if (this.totalPages < 1) {
            console.error("Something is wrong, the total pages should >=1");
        }
        this.pages = [this.currentPage - 2, this.currentPage - 1, this.currentPage, this.currentPage + 1, this.currentPage + 2];

        if (this.currentPage - 2 < 1) {
            let leftOffset = 1 - this.pages[0];
            for (let i = 0; i < this.pages.length; i++) {
                this.pages[i] += leftOffset;
            }
        }
        if (this.pages[4] > this.totalPages) {
            let rightOffset = this.totalPages - this.pages[4];
            for (let i = 0; i < this.pages.length; i++) {
                this.pages[i] -= rightOffset;
            }
        }

        if (this.totalPages < 5) {
            this.pages = [];
            for (let i = 0; i < this.pages.length; i++) {
                this.pages[i] = i;
            }
        }
    }

}
