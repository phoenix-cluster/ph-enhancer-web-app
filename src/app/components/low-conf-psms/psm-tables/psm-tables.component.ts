import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Psm} from '../../../model/psm'
import {PsmTableService} from '../../../services/psm-tabel.service'
import {SpectrumService} from '../../../services/spectrum.service'
import {Spectrum} from "../../../model/spectrum";
import {Page} from "../../../model/page";
import 'rxjs/add/operator/toPromise';
import { saveAs } from 'file-saver/FileSaver';
import {Http} from "@angular/http";
import {PSMsPage} from "../../../model/psmsPage";
import {ExportConfig} from "../../../model/export-config";

@Component({
    selector: 'app-psm-tables',
    templateUrl: './psm-tables.component.html',
    styleUrls: ['./psm-tables.component.scss'],
})
export class PsmTablesComponent implements OnInit {

    @Input() psmType: string;
    @Input() projectId: string;
    selected_psms = [];
    selected_specs = [];
    selectedPsm: Psm;
    selectedSpectrum: Spectrum;
    psm_rows: Array<Psm>;
    spec_rows: Array<Spectrum>;
    private defaultAcceptanceOfRecommPsm: boolean;//true means accept, false means reject
    downloadJsonHref:string; //for result download

    page = new Page();
    loading: boolean = false;
    isDefaultSort: boolean = true;
    private activedHistItem: number;

    private export:ExportConfig;


    constructor(private psmTableService: PsmTableService,
                private spectrumService: SpectrumService,
                private http: Http,
                ) {
        this.selectedPsm = new Psm("null_cluster_id");
        this.selectedSpectrum = new Spectrum("null_spectrum_title", null, null);
        this.page = new Page();
        // this.cachedAcceptanceListOfRecommPsm = new Map<number, number>();
        this.defaultAcceptanceOfRecommPsm = null;//true means accept, false means reject
        this.psm_rows = new Array<Psm>();
        this.spec_rows = new Array<Spectrum>();
        this.export = new ExportConfig();
    }

    ngOnInit() {
        this.setPageData(this.page);
        this.isDefaultSort = true;
    }

    onAcceptClick(row): void {
        row.acceptance = row.acceptance + 1;
        if (row.acceptance == 2) {
            row.acceptance = -1;
        }
        let accpetanceMap = new Map<number, number>();
        accpetanceMap.set(row.id, row.acceptance);
        this.psmTableService.uploadUserAcceptance(this.psmType, accpetanceMap).then(
            result => {
            }
        ).catch(error => console.log(error))
    }

    setSpectrumTable(spectraTitles: string[]): void {
        this.spec_rows = [];
        for (var i = 0; i < spectraTitles.length; i += 100) {
            var endIndex = i + 100;
            if (endIndex > spectraTitles.length) endIndex = spectraTitles.length;
            var tempSpectraTitlesStr = spectraTitles.slice(i, endIndex).join("||");
            this.spectrumService.getSpectra(tempSpectraTitlesStr)
                .then(spectra => {
                        this.spec_rows = this.spec_rows.concat(spectra);
                        this.selectedSpectrum = this.spec_rows[0];
                        this.selected_specs = [];
                        this.selected_specs.push(this.selectedSpectrum);

                    }
                ).catch(this.handleError);
        }
    }


    private handleError(error: any): void {
        console.log('A error occurred', error);
    }

    setPage(event) {
        this.page.pageNumber = event.offset + 1;
        this.setPageData(this.page);
    }

    setPageData(page: Page) {
        this.loading = true;
        this.psmTableService.getPsmsPage("PXD001464", this.psmType, page).then(psmPage => {
            this.page.totalElements = psmPage.totalElements;
            this.page.totalPages = psmPage.totalPages;
            this.psm_rows = psmPage.scoredPSMs;
            this.selectedPsm = this.psm_rows[0];
            this.selected_psms = [];
            this.selected_psms.push(this.selectedPsm);
            this.loading = false;
            this.setSpectrumTable(this.psm_rows[0].spectraTitles);
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

    onSelectPsm({selected}) {
        this.selectedPsm = selected[0];
        this.selected_psms = selected;
        this.setSpectrumTable(this.selectedPsm.spectraTitles);
        this.activedHistItem = Math.floor(Math.random() * 10);
    }

    onActivatePsm(event) {
        // console.log('Activate Event', event);
    }

    onSelectSpec({selected}) {
        this.selectedSpectrum = selected[0];
        // console.log('Select Event', selected_psms, this.selectedPsm);
    }

    onActivateSpec(event) {
        // console.log('Activate Event', event);
    }

    getAcceptClass(acceptance: number) {
        switch (acceptance) {
            case -1 :
                return "fa fa-ban mannual_acceptance";

            case 0 :
                return "fa fa-circle-o default_acceptance";

            case 1 :
                return "fa fa-check-circle-o mannual_acceptance";
        }

    }

    saveFile() {
        this.psmTableService.getPsmsPage("PXD001464", this.psmType, new Page())
            .then(psmPage => this.saveToFileSystem(psmPage));
    }

    private saveToFileSystem(psmPage:PSMsPage) {
        const filename = 'test.json';
        var jsonse = JSON.stringify(psmPage);
        const blob = new Blob([jsonse], { type: 'text/plain' });
        saveAs(blob, filename);
    }

    // onCheckClick(id:string){
    //     var checkButton = <HTMLInputElement> document.getElementById(id);
    //     alert(this.export.recommBetter);
    // }



}
