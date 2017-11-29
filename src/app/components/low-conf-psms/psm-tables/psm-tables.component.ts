import {Component, OnInit} from '@angular/core';
import {Psm} from '../../../models/psm'
import {PsmTableService} from '../../../services/psm-tabel.service'
import {Spectrum} from "../../../models/spectrum";

@Component({
    selector: 'app-psm-tables',
    templateUrl: './psm-tables.component.html',
    styleUrls: ['./psm-tables.component.scss']
})
export class PsmTablesComponent implements OnInit {


    private psmHeaders = Psm.psmHeaders;
    private spectrumHeaders = Spectrum.spectrumHeaders;
    private currentPage:number = 1;
    private currentSize:number = 10;
    private currentSortField = "confidentScore";
    private currentSortDirection = "DESC";
    private elemStart:number = (this.currentPage - 1) * this.currentSize + 1;
    private elemEnd:number = this.elemStart + this.currentSize - 1;
    private totalElem:number = 0;
    private totalPages:number = 0;
    private pages:number[];
    private sortByCol:string = "confidentScore";
    private currentPsm:Psm;
    private currentSpectrumInProject:Spectrum;


    rows = [
        { name: 'Austin', gender: 'Male', company: 'Swimlane' },
        { name: 'Dany', gender: 'Male', company: 'KFC' },
        { name: 'Molly', gender: 'Female', company: 'Burger King' },
    ];
    columns = [
        { prop: 'name' },
        { name: 'Gender' },
        { name: 'Company' }
    ];

    constructor(private psmTableService: PsmTableService,) {
        this.currentPsm = new Psm("null_cluster_id");
        this.currentSpectrumInProject = new Spectrum("null_spectrum_title", null, null)
    }

    psms: Psm[];
    psmMap = new Map<number, Psm>();
    psmIds: number[];
    psmTable = new Array<Psm>();
    spectrumTable = new Array<Spectrum>();

    // getPsms(): void {
    //   this.psmTableService.getPsms().then(psms => {for(let psm of psms) this.psmMap.set(psm['querySpectrumTitle'], psm)});
    //   this.psmTableService.getPsmTitleList(10).then(psmTitles => {this.psmTitles = psmTitles; this.writePsmTable()});
    // }

    getPSMsPage(page: number, size: number, sortField: string, sortDirection: string): void {
        this.psmTableService.getPsmsPage(page, size, sortField, sortDirection).then(psms_page => {
            this.psmMap.clear();
            for (let psm of psms_page.scoredPSMs) this.psmMap.set(psm['id'], psm);
            this.totalElem = psms_page.totalElements;
            this.totalPages = psms_page.totalPages;
            this.setPages();
            this.writePsmTable();
        });
    }

    ngOnInit() {
        this.getPSMsPage(this.currentPage, this.currentSize, this.currentSortField, this.currentSortDirection);
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
        }
    }

    onAcceptClick(checkBoxId: string): void {
        let checkBox: HTMLInputElement = <HTMLInputElement> document.getElementById(checkBoxId);
        if (checkBox.readOnly) checkBox.checked = checkBox.readOnly = false;
        else if (!checkBox.checked) checkBox.readOnly = checkBox.indeterminate = true;
    }

    setIndeterminate(checkBoxId: string): void {
        let checkBox: HTMLInputElement = <HTMLInputElement> document.getElementById(checkBoxId);
        checkBox.indeterminate = true;
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
        this.psmTable = [];
        this.psmIds= [];
        for (let entry of Array.from(this.psmMap.entries())) {
            this.psmIds.push(entry[0]);
            this.psmTable.push(entry[1]);
        }
        ;
        console.log(this.psmTable)
        this.currentPsm = this.psmTable[0];
        this.writeSpectrumTable(this.currentPsm['spectraTitles']);
    }

    writeSpectrumTable(spectraTitlesStr:string) :void{
        let spectraTitles = spectraTitlesStr.split("||");
        this.spectrumTable = [];
        for(var i=0; i<spectraTitles.length; i++){
            // let spectrum:Spectrum = {"title":spectraTitles[i]; "charge":1; "precursorMz":232.1}
            let spectrum = new Spectrum(spectraTitles[i], 1, 232.1);
            this.spectrumTable.push(spectrum);
        }
        console.log(this.spectrumTable)
    }

    onPageSizeChange(size:string): void {
        this.currentSize = parseInt(size);
        this.currentPage = 1;
        this.rewritePsmTable();
    }

    onPageChange(page:number):void{
        this.currentPage = page;
        this.rewritePsmTable();
    }

    rewritePsmTable(): void {
        this.getPSMsPage(this.currentPage, this.currentSize, this.currentSortField, this.currentSortDirection);

        this.elemStart = (this.currentPage - 1) * this.currentSize + 1;
        this.elemEnd = (this.elemStart + this.currentSize) - 1;
        this.currentPsm = this.psmTable[0];
        console.log(this.currentPsm['spectraTitles']);
        this.writeSpectrumTable(this.currentPsm['spectraTitles']);
    }

    onClickReSort(headItem):void{
        let index = this.psmHeaders.indexOf(headItem);
        if (headItem['order'] == 'asc'){
            this.psmHeaders[index]['order'] = 'desc';
        }
        else{
            this.psmHeaders[index]['order'] = 'asc';
        }
        this.sortByCol = this.psmHeaders[index]['headName'];
    }

    onRowClick(psm:Psm):void{
        this.currentPsm = psm;
        this.writeSpectrumTable(this.currentPsm['spectraTitles']);
    }

    onSpectrumRowClick(spectrum:Spectrum):void{
        this.currentSpectrumInProject = spectrum;
        alert(this.currentSpectrumInProject.title);
    }


    private setPages(): void {
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

}
