import {Component, Input, OnChanges, OnInit} from '@angular/core';

import {Psm} from "../../../../model/psm";
import {ClusterService} from "../../../../services/cluster.service";
import {Spectrum} from "../../../../model/spectrum";
import {Cluster} from "../../../../model/cluster";
import {LocalStorageService} from "../../../../services/local-storage.service";
import {Modification} from "../../../../model/modification";
import {Specview} from "../../../../utils/specview/specview";

@Component({
    selector: 'app-spectra-comparer',
    templateUrl: './spectra-comparer.component.html',
    providers: [Cluster],
    styleUrls: ['./spectra-comparer.component.scss']

})
export class SpectraComparerComponent implements OnChanges {
    @Input() selectedPsm: Psm;
    @Input() spectrum: Spectrum;
    @Input() psmType: String;
    // @Input() currentCluster:Cluster;
    private currentClusterId;
    private currentCluster: Cluster;
    private currentSpectrumTitle: string;

    private psm_sequence: string;
    private psm_varMods: any[];
    private psm_ntermMod: number;
    private psm_ctermMod: number;
    private psm_peaks: any[];
    private psm_charge: number;
    private psm_title: string;
    private psm_precursorMz: number;

    private cluster_peaks: any[];

    constructor(private clusterService: ClusterService,
                private localStorageService: LocalStorageService) {
        this.psm_varMods = [];
    }


    ngOnChanges() {
        this.currentClusterId = this.selectedPsm.clusterId;
        if(this.spectrum != null) {
            this.currentSpectrumTitle = this.spectrum.title;
            if (this.currentClusterId != null && this.currentClusterId != "null_cluster_id"
                && this.spectrum != null && this.spectrum.title != "null_spectrum_title") {
                this.resetDataAndRefresh();
            }
        }
    }

    private resetDataAndRefresh(): void {

        // this.spectrumTableService.getSpectrum(this.selectedPsmTitle).
        // then(spectrum =>{this.selectedPsm = spectrum});

        this.psm_sequence = this.selectedPsm.peptideSequence;
        if (this.psm_sequence == null && this.selectedPsm.recommendPeptide != null) {
            var re = /R_Better_|PRE_|R_NEW_/gi;
            this.psm_sequence = this.selectedPsm.recommendPeptide.replace(re,"");
        }
        //todo psm should be considered here
        // modification index = 14; modification mass = 16.0; modified residue = 'M'
        // this.psm_varMods[0] = {index: 14, modMass: 16.0, aminoAcid: 'M'};
        //todo: do we need to add this?
        // mass to be added to the N-terminus
        // this.psm_ntermMod = 164.07;
        if(this.psmType == "negscore" || this.psmType == "posscore")
            this.set_mods(this.selectedPsm.peptideMods, this.selectedPsm.peptideSequence);
        if(this.psmType == "newid" )
            this.set_mods(this.selectedPsm.recommendPepMods, this.selectedPsm.recommendPeptide);
        this.psm_charge = this.spectrum.charge;
        this.psm_title = this.spectrum.title;

        // peaks in the scan: [m/z, intensity] pairs.
        this.psm_peaks = this.getPsmPeaks(this.spectrum);
        this.clusterService.getACluster(this.currentClusterId).then(
            cluster => {
                this.currentCluster = cluster;
                this.cluster_peaks = this.getClusterPeaks(this.currentCluster);
                if (this.psmType == "negscore") {
                    this.resetCheckRecommButton();
                }
                this.refreshViewer();
            }).catch(this.handleError);

    }

    private refreshViewer(): void {
        var specviewer = document.getElementById("lorikeet");
        while (specviewer.firstChild) {
            specviewer.removeChild(specviewer.firstChild);
        }
        if (this.psm_peaks == null || this.cluster_peaks == null) {
            console.error("this.psm_peaks or this.cluster_peaks is null");
            return;
        }

        let opt = {
            sequence: this.psm_sequence,
            // scanNum: 2441,
            charge: this.psm_charge,
            precursorMz: this.psm_precursorMz,
            fileName: this.psm_title,
            //staticMods: staticMods,
            variableMods: this.psm_varMods,
            ntermMod: this.psm_ntermMod,
            ctermMod: this.psm_ctermMod,
            peaks: this.psm_peaks,
            peaks2: this.cluster_peaks
        };

        let specView = new Specview("#lorikeet", opt);
        specView.refresh();
    }

    private onCheckRecommClick() {
        var checkRecommButton = document.getElementById("checkRecommButton");
        if (checkRecommButton.innerText == "Check Recommend Sequence") {
            checkRecommButton.innerText = "Check Original Sequence";
            var re = /R_Better_|PRE_/gi;
            this.psm_sequence = this.selectedPsm.recommendPeptide.replace(re,"");
            this.set_mods(this.selectedPsm.recommendPepMods, this.selectedPsm.recommendPeptide);
        }
        else {
            checkRecommButton.innerText = "Check Recommend Sequence";
            this.psm_sequence = this.selectedPsm.peptideSequence;
            this.set_mods(this.selectedPsm.peptideMods, this.selectedPsm.peptideSequence);
        }
        this.refreshViewer()
    }

    private resetCheckRecommButton() {
        var checkRecommButton = document.getElementById("checkRecommButton");
        if (checkRecommButton != null) {
            checkRecommButton.innerText = "Check Recommend Sequence";
        }
    }


    private getClusterPeaks(cluster: Cluster): any[] {
        if (cluster == null) {
            return;
        }
        let mzArray = cluster.consensusMz;
        let intensArray = cluster.consensusIntens;

        if (mzArray.length != intensArray.length) {
            console.error("Error, the length of mzArray and intensArray is diffrent");
        }

        let clusterPeaks = [];
        for (var i = 0; i < mzArray.length; i++) {
            let apeak = [mzArray[i], intensArray[i]];
            clusterPeaks.push(apeak)
        }
        return clusterPeaks;
    }

    private handleError(error: any): void {
        console.log('A error occurred', error);
    }

    private getPsmPeaks(spectrum: Spectrum): any[] {
        let mzArray = spectrum.peaklistMz;
        let intensArray = spectrum.peaklistIntens;

        if (mzArray == null) {
            return null;
        }
        if (mzArray.length != intensArray.length) {
            console.error("Error, the length of mzArray and intensArray is diffrent");
            return null;
        }

        let peaks = [];
        for (var i = 0; i < mzArray.length; i++) {
            let apeak = [mzArray[i], intensArray[i]];
            peaks.push(apeak)
        }
        return peaks;
    }

        //todo psm should be considered here
        // modification index = 14; modification mass = 16.0; modified residue = 'M'
        // this.psm_varMods[0] = {index: 14, modMass: 16.0, aminoAcid: 'M'};
        //todo: do we need to add this?
        // mass to be added to the N-terminus
        // this.psm_ntermMod = 164.07;
    private set_mods(peptideMods: Modification[], peptideSeq: string) {
        this.psm_ntermMod = 0;
        this.psm_varMods.length = 0;
        if(peptideMods == null) {
            return;
        }
        for (var i = 0; i < peptideMods.length; i++) {
            var j = 0;
            let mod:Modification = peptideMods[i];
            if (mod.location == 0){
                this.psm_ntermMod = mod.deltaMass;
            }else if (mod.location == peptideSeq.length + 1){
                this.psm_ctermMod = mod.deltaMass;
            }
            else{
                this.psm_varMods[j++] = {index: mod.location, modMass: mod.deltaMass, aminoAcid: mod.residue};
            }
        }
    }
}
