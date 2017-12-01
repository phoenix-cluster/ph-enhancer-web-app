import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {SpectrumInCluster} from "../../../../models/spectrum-in-cluster";
import {SpectraInClusterTableService} from "../../../../services/spectra-in-cluster-tabel.service";
import {ClusterService} from "../../../../services/cluster.service";
import {Cluster} from "../../../../models/cluster";
import {map} from "rxjs/operator/map";
import {SpectrumService} from "../../../../services/spectrum.service";

@Component({
    selector: 'app-cluster-spectra-table',
    templateUrl: './cluster-spectra-table.component.html',
    styleUrls: ['./cluster-spectra-table.component.scss']
})
export class ClusterSpectraTableComponent implements OnChanges {
    @Input() currentClusterId:string;
    private spectrumInClusterHeaders = SpectrumInCluster.spectrumInClusterHeaders;
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

    // private currentClusterId: string = "";
    private allSpectraTitlesOfaCluster: string[];
    private currentSpectraTitles: string[];
    private currentCluster: Cluster;
    private currentSpectra: SpectrumInCluster[];


    constructor(private spectrumInClusterTableService: SpectraInClusterTableService,
                private spectrumService:SpectrumService,
                private clusterService: ClusterService) {
    }

    // spectra : SpectrumInCluster[];
    // spectrumInClusterMap = new Map<string, SpectrumInCluster>();
    spectrumInClusterTitles: string[];
    spectrumInClusterTable = new Array<SpectrumInCluster>();

    getSpectra(): void {
        // this.spectrumInClusterTableService.getSpectra().then(spectra => {this.spectrumInClusterTable = spectra});
        // this.spectrumInClusterTableService.getSpectraTitleList(10).then(spectrumInClusterTitles => {this.spectrumInClusterTitles = spectrumInClusterTitles; this.writeSpectrumInClusterTable()});
    }

    ngOnChanges() {
        this.currentPage = 1;
        this.currentSize = 10;
        this.rewriteSpectrumInClusterTable();
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

    onPageSizeChange(size: string): void {
        this.currentSize = parseInt(size);
        this.currentPage = 1;
        this.rewriteSpectrumInClusterTable();
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        console.log("set current page to " + page);
        this.rewriteSpectrumInClusterTable();
    }

    rewriteSpectrumInClusterTable(): void {
        this.elemStart = (this.currentPage - 1) * this.currentSize + 1;
        this.elemEnd = (this.elemStart + this.currentSize) - 1;
        if(this.currentClusterId != "null_cluster_id")
            {this.getAllSpectraTitlesAndSet();}

        // this.getSpectraPage(this.currentPage, this.currentSize, this.currentSortField, this.currentSortDirection);
    }

    private setCurrentSpectra(): void {
        let titles = this.currentSpectraTitles.join("||");
        this.spectrumInClusterTableService.getSpectra(titles).then(spectra => {
            this.currentSpectra = spectra;
            //todo this.rePageSpectrumInClusterTable();
        }).catch(this.handleError)
    }

    private setCurrentSpectraTitles(): void {
        this.currentSpectraTitles = this.allSpectraTitlesOfaCluster.slice(this.elemStart - 1, this.elemEnd);
    }

    private getAllSpectraTitlesAndSet(): void {
        // let cluster:Cluster = JSON.parse(localStorage.getItem(clusterId));
        // if (cluster == null){
        this.clusterService.getACluster(this.currentClusterId).then(cluster => {
            this.currentCluster = cluster;
            localStorage.setItem(cluster.id, JSON.stringify(cluster));
            this.allSpectraTitlesOfaCluster = cluster.spectraTitles;
            // console.log(this.allSpectraTitlesOfaCluster);
            this.setPages();
            this.setCurrentSpectraTitles();
            this.setCurrentSpectra();
        }).catch(this.handleError);
        // }
    }

    onClickReSort(headItem): void {
        let index = this.spectrumInClusterHeaders.indexOf(headItem);
        if (headItem['order'] == 'asc') {
            this.spectrumInClusterHeaders[index]['order'] = 'desc';
        }
        else {
            this.spectrumInClusterHeaders[index]['order'] = 'asc';
        }
        this.sortByCol = this.spectrumInClusterHeaders[index]['headName'];
    }

    private setPages(): void {
        this.totalElem = this.allSpectraTitlesOfaCluster.length;
        this.totalPages = Math.floor(this.totalElem/this.currentSize) + 1;
        if (this.totalPages < 1) {
            console.error("Something is wrong, the total pages should >=1");
        }

        this.pages = [this.currentPage - 2, this.currentPage - 1, this.currentPage, this.currentPage + 1, this.currentPage + 2];

        if (this.totalPages < 5) {
            this.pages = [];
            for (let i = 0; i < this.totalPages; i++) {
                this.pages[i] = i+1;
            }
            return;
        }

        if (this.currentPage - 2 < 1) {
            let leftOffset = 1 - this.pages[0];
            for (let i = 0; i < this.pages.length; i++) {
                this.pages[i] += leftOffset;
            }
        }

        if (this.pages[4] > this.totalPages) {
            let rightOffset =  this.pages[4] -  this.totalPages;
            for (let i = 0; i < this.pages.length; i++) {
                this.pages[i] -= rightOffset;
            }
        }

    }

    private handleError(error: any): void {
        console.log('A error occurred', error);
    }

}
