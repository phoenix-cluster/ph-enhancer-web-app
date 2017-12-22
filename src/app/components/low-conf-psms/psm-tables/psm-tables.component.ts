import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Psm} from '../../../model/psm'
import {PsmTableService} from '../../../services/psm-tabel.service'
import {SpectrumService} from '../../../services/spectrum.service'
import {Spectrum} from "../../../model/spectrum";
import {PSMsPage} from "../../../model/psmsPage";
import {Page} from "../../../model/page";
import {FormControl} from "@angular/forms";
import {DatatableComponent} from "@swimlane/ngx-datatable";

@Component({
    selector: 'app-psm-tables',
    templateUrl: './psm-tables.component.html',
    styleUrls: ['./psm-tables.component.scss'],
})
export class PsmTablesComponent implements OnInit {

    @Input() psmType:string;
    // private psmHeaders = Psm.psmHeaders;
    // private spectrumHeaders = Spectrum.spectrumHeaders;
    // private currentPage:number = 1;
    // private currentSize:number = 10;
    // private currentSortField = "confidentScore";
    // private currentSortDirection = "DESC";
    // private elemStart:number = (this.currentPage - 1) * this.currentSize + 1;
    // private elemEnd:number = this.elemStart + this.currentSize - 1;
    // private currentPsm:Psm;
    selected_psms = [];
    selected_specs = [];
    selectedPsm:Psm;
    // private currentSpectrumInProject:Spectrum;
    selectedSpectrum:Spectrum;
    psm_rows : Array<Psm>;
    spec_rows : Array<Spectrum>;
    // private cachedAcceptanceListOfRecommPsm:Map<number, number>; //id, accept(1)/reject(-1)/default(0), the ids which are not updated to server yet
    private defaultAcceptanceOfRecommPsm:boolean;//true means accept, false means reject
    // private defaultAcceptanceOfNegPsm:boolean;
    // private defaultAcceptanceOfPosPsm:boolean;

    page = new Page();
    loading: boolean = false;
    isDefaultSort: boolean = true;


    constructor(private psmTableService: PsmTableService,
                private spectrumService:SpectrumService){
        this.selectedPsm = new Psm("null_cluster_id");
        this.selectedSpectrum = new Spectrum("null_spectrum_title", null, null);
        this.page = new Page();
        // this.cachedAcceptanceListOfRecommPsm = new Map<number, number>();
        this.defaultAcceptanceOfRecommPsm = null;//true means accept, false means reject
        this.psm_rows = new Array<Psm>();
        this.spec_rows = new Array<Spectrum>();
    }

    // psms: Psm[];
    // psmTable = new Array<Psm>();
    // spectrumTable = new Array<Spectrum>();

    // getPsms(): void {
    //   this.psmTableService.getPsms().then(psms => {for(let psm of psms) this.psmMap.set(psm['querySpectrumTitle'], psm)});
    //   this.psmTableService.getPsmTitleList(10).then(psmTitles => {this.psmTitles = psmTitles; this.writePsmTable()});
    // }


    // isDefaultAccepted(id:number):boolean{
    //     let acceptance:boolean = this.getAcceptanceStatusOfPsm(id);
    //     console.log(acceptance == this.defaultAcceptanceOfRecommPsm);
    //     return (acceptance == this.defaultAcceptanceOfRecommPsm);
    // }

    /**
     * Set the default acceptance status for psmType Psms, true for accept, false for reject
     * @param defautAccpetance
     */
    setDefaultAcceptance(defautAccpetance:boolean){
        this.defaultAcceptanceOfRecommPsm = defautAccpetance;
    }


    getPSMsPage(page: number, size: number, sortField: string, sortDirection: string): void {
        if(this.psmType == "negscore") {
            // this.psmTableService.getNegPsmsPage2(page, size, sortField, sortDirection).then(psms_page => {
            //     this.afterDataRetrieving(psms_page);
            // });
        }

        if(this.psmType == "recomm"){
            // this.psmTableService.getRecommIdPsmsPage(page, size, sortField, sortDirection).then(psms_page => {
            //     this.afterDataRetrieving(psms_page);
            // });
        }

        if(this.psmType == "posscore"){
            // console.log("here");
            // this.psmTableService.getPosPsmsPage(page, size, sortField, sortDirection).then(psms_page => {
            //     this.afterDataRetrieving(psms_page);
            // });
        }

    }

    ngOnInit() {
        // if(this.psmType == "negscore") {this.currentSortDirection = "ASC"}
        // if(this.psmType == "posscore") {this.currentSortDirection = "DESC"}
        // if(this.psmType == "recomm") {this.currentSortDirection = "DESC"}
        // this.getPSMsPage(this.currentPage, this.currentSize, this.currentSortField, this.currentSortDirection);
        this.setPageData(this.page);
        this.isDefaultSort = true;//make confidentscore show the default sort direction
    }

    getClassByOrder(item): string {
        switch (item.order) {
            case 'False': {
                return '';
            }
            case 'asc': {
                return 'fa-sort-up';
            }
            case 'desc': {
                return 'fa-sort-down';
            }
            case 'True': {
                return 'fa-sort';
            }
        }
    }

    onAcceptClick(row): void {
        row.acceptance = row.acceptance + 1;
        if(row.acceptance == 2) {
            row.acceptance = -1;
        }
        let accpetanceMap = new Map<number, number> ();
        accpetanceMap.set(row.id, row.acceptance);
        this.psmTableService.uploadUserAcceptance(this.psmType, accpetanceMap).then(
            result=> {
            }
        ).catch(error => console.log(error))
    }


    /** write the table by search terms, pagenations, asec/dec ...
     *  based on the psmTitles, which comes from the server
     */
    // writePsmTable():void{
    //   this.psmTable = [];
    //   for(var psmTitle of this.psmTitles){
    //     this.psmTable.push(this.psmMap.get(psmTitle))
    //   }
// }

    /** write the table by search terms, pagenations, asec/dec ...
     *  based on the psmTitles, which comes from the server
     */
    writePsmTable(): void {
        // this.currentPsm =
        // this.psmTable = [];
        // this.psmIds= [];
        // for (let entry of Array.from(this.psmMap.entries())) {
        //     this.psmIds.push(entry[0]);
        //     this.psmTable.push(entry[1]);
        // };
        // this.currentPsm = this.psmTable[0];
        // this.writeSpectrumTable(this.currentPsm['spectraTitles']);
    }

    setSpectrumTable(spectraTitles:string[]) :void{
        this.spec_rows= [];
        for(var i=0; i<spectraTitles.length; i+=100) {
            var endIndex = i + 100;
            if (endIndex>spectraTitles.length) endIndex = spectraTitles.length;
            var tempSpectraTitlesStr = spectraTitles.slice(i, endIndex).join("||");
            this.spectrumService.getSpectra(tempSpectraTitlesStr)
                .then(spectra => {
                        this.spec_rows = this.spec_rows.concat( spectra);
                        this.selectedSpectrum = this.spec_rows[0];
                    }
                ).catch(this.handleError);
        }
    }

    // onPageSizeChange(size:string): void {
    //     this.currentSize = parseInt(size);
    //     this.currentPage = 1;
    //     this.rewritePsmTable();
    // }
    //
    // onPageChange(page:number):void{
    //     this.currentPage = page;
    //     this.rewritePsmTable();
    // }

    rewritePsmTable(): void {
        // this.getPSMsPage(this.currentPage, this.currentSize, this.currentSortField, this.currentSortDirection);
        //
        // this.elemStart = (this.currentPage - 1) * this.currentSize + 1;
        // this.elemEnd = (this.elemStart + this.currentSize) - 1;
        // this.currentPsm = this.psmTable[0];
        // console.log(this.currentPsm['spectraTitles']);
        // this.writeSpectrumTable(this.currentPsm['spectraTitles']);
    }

    // onClickReSort(headItem):void{
    //     let index = this.psmHeaders.indexOf(headItem);
    //     for(var i=0; i<this.psmHeaders.length; i++) {
    //         if(this.psmHeaders[i]['order'] != 'False' && i != index){
    //             this.psmHeaders[i]['order'] = 'True';//set all sortable to ready status
    //         }
    //     }
    //     //set clicked headitem to right direction
    //     if (this.psmHeaders[index]['order'] == 'asc'){
    //         this.psmHeaders[index]['order'] = 'desc';
    //     } else if (this.psmHeaders[index]['order'] == 'desc'){
    //         this.psmHeaders[index]['order'] = 'asc';
    //     } else if (this.psmHeaders[index]['order'] == 'True'){
    //         this.psmHeaders[index]['order'] = 'desc';
    //     }
    //     this.currentSortField = this.psmHeaders[index]['headName'];
    //     this.currentSortDirection = this.psmHeaders[index]['order'];
    //     this.rewritePsmTable();
    // }

    // onRowClick(psm:Psm):void{
    //     this.currentPsm = psm;
    //     this.writeSpectrumTable(this.currentPsm['spectraTitles']);
    // }
    //
    // onSpectrumRowClick(spectrum:Spectrum):void{
    //     this.currentSpectrumInProject = spectrum;
    // }


    // private setPages(): void {
    //     if (this.totalPages < 1) {
    //         console.error("Something is wrong, the total pages should >=1");
    //     }
    //
    //     this.pages = [this.currentPage - 2, this.currentPage - 1, this.currentPage, this.currentPage + 1, this.currentPage + 2];
    //
    //     if (this.totalPages < 5) {
    //         this.pages = [];
    //         for (let i = 0; i < this.totalPages; i++) {
    //             this.pages[i] = i+1;
    //         }
    //         return;
    //     }
    //
    //     if (this.currentPage - 2 < 1) {
    //         let leftOffset = 1 - this.pages[0];
    //         for (let i = 0; i < this.pages.length; i++) {
    //             this.pages[i] += leftOffset;
    //         }
    //     }
    //
    //     if (this.pages[4] > this.totalPages) {
    //         let rightOffset =  this.pages[4] -  this.totalPages;
    //         for (let i = 0; i < this.pages.length; i++) {
    //             this.pages[i] -= rightOffset;
    //         }
    //     }
    //
    // }

    // private afterDataRetrieving(psms_page: PSMsPage) {
    //     this.psmMap.clear();
    //     for (let psm of psms_page.scoredPSMs) {
    //                 // psm.acceptance = this.acceptanceListOfRecommPsm.get(psm.id);
    //         if(psm.acceptance == null) {
    //             psm.acceptance = 0;
    //         }
    //         this.psmMap.set(psm['id'], psm);
    //     }
    //     console.log(this.psmMap);
    //     this.totalElem = psms_page.totalElements;
    //     this.totalPages = psms_page.totalPages;
    //     this.setPages();
    //     this.writePsmTable();
    // }


    // private setAcceptanceForPsm(id:number, acceptanceStatus:number){
    //     this.cachedAcceptanceListOfRecommPsm.set(id, acceptanceStatus);
    //     this.uploadUserAcceptance();
    // }

    // private isPsmSelected(id:number):boolean {
    //     return this.currentPsm.id == id;
    // }
    // private isSpectrumSelected(title:string):boolean{
    //         return this.currentSpectrumInProject.title == title;
    // }
    private handleError(error: any): void {
        console.log('A error occurred', error);
    }

    // private uploadUserAcceptance(): void{
    //     if(this.cachedAcceptanceListOfRecommPsm.size == 0) return;
    //     this.psmTableService.uploadUserAcceptance(this.psmType, this.cachedAcceptanceListOfRecommPsm).then(
    //         result=> {
    //             this.cachedAcceptanceListOfRecommPsm.clear();
    //         }
    //     ).catch(error => console.log(error))
    //     ;
    // }


    setPage(event){
        this.page.pageNumber = event.offset + 1;
        this.setPageData(this.page);
    }

    setPageData(page:Page){
        this.loading = true;
        this.psmTableService.getNegPsmsPage(page).then(psmPage =>{
            this.page.totalElements = psmPage.totalElements;
            this.page.totalPages = psmPage.totalPages;
            this.psm_rows = psmPage.scoredPSMs;
            this.selectedPsm = this.psm_rows[0];
            this.setSpectrumTable(this.psm_rows[0].spectraTitles);
            this.loading = false;
        });
    }

    onSort(event) {
        // event was triggered, start sort sequence
        // console.log('Sort Event', event);
        this.loading = true;
        this.isDefaultSort = false;
        this.page = new Page();
        this.page.sortDirection = event.sorts[0].dir;
        this.page.sortField = event.sorts[0].prop;
        this.setPageData(this.page)
    }

    // setSpecData(spectrumTitles:string[]){
    //     this.spectrumService.getSpectra(spectrumTitles.join("||")).then( p
    //
    //     );
    // }
    onSelectPsm({ selected }) {
        this.selectedPsm= selected[0];
        this.setSpectrumTable(this.selectedPsm.spectraTitles);
    }

    onActivatePsm(event) {
        // console.log('Activate Event', event);
    }

    onSelectSpec({ selected}) {
        this.selectedSpectrum = selected[0];
        // console.log('Select Event', selected_psms, this.selectedPsm);
    }

    onActivateSpec(event) {
        // console.log('Activate Event', event);
    }
    //for select limit of page
    // @ViewChild(DatatableComponent) private datatable: DatatableComponent;
    // public currentPageLimit: number = 0;
    // public pageLimitOptions = [
    //     {value: 10},
    //     {value: 25},
    //     {value: 50},
    //     {value: 100},
    // ];
    //
    // public onLimitChange(limit: any): void {
    //     this.changePageLimit(limit);
    //     this.datatable.limit = this.currentPageLimit;
    //     this.page.size = this.currentPageLimit;
    //     this.setPageData(this.page);
    // }
    //
    // private changePageLimit(limit: any): void {
    //     this.currentPageLimit = parseInt(limit, 10);
    // }

    getAcceptClass(acceptance:number){
        switch(acceptance){
            case -1 :
                return  "fa fa-ban mannual_acceptance";

            case 0 :
                return  "fa fa-circle-o default_acceptance";

            case 1 :
                return  "fa fa-check-circle-o mannual_acceptance";
        }

    }


}
