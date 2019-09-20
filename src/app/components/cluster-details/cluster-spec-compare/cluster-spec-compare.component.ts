import { Component, OnInit, Input } from '@angular/core';
import {Spectrum} from "../../../model/spectrum";
import {Cluster} from "../../../model/cluster";
import jQuery from 'jquery';
import $ from 'jquery';
import "../../../../assets/js/lorikeet/specview.js";
import "../../../../assets/js/lorikeet/jquery.flot.js";
import "../../../../assets/js/lorikeet/jquery.flot.selection.js";
import "../../../../assets/js/lorikeet/peptide.js";
import "../../../../assets/js/lorikeet/aminoacid.js";
import "../../../../assets/js/lorikeet/ion.js";
import { SpectrumService } from '../../../services/spectrum.service';

@Component({
  selector: 'app-cluster-spec-compare',
  templateUrl: './cluster-spec-compare.component.html',
  styleUrls: ['./cluster-spec-compare.component.scss']
})
export class ClusterSpecCompareComponent implements OnInit {

  @Input() spectrum: Spectrum;
  @Input() cluster: Cluster;
  cluster_peaks: any[];
  spec_peaks : any[];
  spec_sequence : string;
  spec_charge : number;
  spec_precursorMz : number;
  spec_title : string;
  constructor(private spectrumService : SpectrumService) {
    this.spectrum = null;
    this.cluster = null;
    this.spec_peaks = [[1]];
    this.cluster_peaks = [[1]];
    this.spec_charge = 0;
    this.spec_title = "You can use this compare tool by clicking the spectra title";
    this.spec_sequence = "peptide sequence is loading";
    this.spec_precursorMz = 0;
  }

  ngOnInit() { 
    this.refreshViewer();
  }
  ngOnChanges(){
    if(this.spectrum == null || this.cluster == null){
        return;
    }
    console.log(this.spectrum);
    this.spec_peaks = this.getSpectrumPeaks(this.spectrum);
    this.cluster_peaks = this.getClusterPeaks(this.cluster);
    this.spec_charge = this.spectrum.charge;
    this.spec_title = this.spectrum.title;
    this.spec_precursorMz = this.spectrum.precursorMz;
    this.getPeptideSequence(this.spec_title);
    this.refreshViewer();
  }

  private refreshViewer(): void {
    let specviewer = document.getElementById("lorikeet_cluster");
    while (specviewer.firstChild) {
        specviewer.removeChild(specviewer.firstChild);
    }
    if (this.spec_peaks == null || this.cluster_peaks == null) {
        console.error("this.spec_peaks or this.cluster_peaks is null");
        return;
    }

    $("#lorikeet_cluster").specview({
        sequence: this.spec_sequence,
        // scanNum: 2441,
        charge: this.spec_charge,
        precursorMz: this.spec_precursorMz,
        fileName: this.spec_title,
        //staticMods: staticMods,
        // variableMods: this.psm_varMods,
        // ntermMod: this.psm_ntermMod,
        // ctermMod: this.psm_ctermMod,
        peaks: this.spec_peaks,
        peaks2: this.cluster_peaks
    });
  }

  private getSpectrumPeaks(spectrum: Spectrum): any[] {
    if (spectrum == null) {
        return;
    }
    let mzArray = spectrum.peaklistMz;
    let intensArray = spectrum.peaklistIntens;

    if (mzArray.length != intensArray.length) {
        console.error("Error, the length of mzArray and intensArray is diffrent");
    }

    let specPeaks = [];
    for (let i = 0; i < mzArray.length; i++) {
        let apeak = [mzArray[i], intensArray[i]];
        specPeaks.push(apeak)
    }
    // console.log(specPeaks[0]);
    return specPeaks;
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
    for (let i = 0; i < mzArray.length; i++) {
        let apeak = [mzArray[i], intensArray[i]];
        clusterPeaks.push(apeak)
    }

    return clusterPeaks;
}
 private getPeptideSequence(title : string) : void{
    this.spectrumService.getPeptide(title)
         .then(peptide =>{
            this.spec_sequence = peptide;
            this.refreshViewer();
            // console.log("peptide "+peptide);
         });
 }
 private handleError(error: any): Promise<any> {
    console.log('A error occurred', error);
    return Promise.reject(error.message || error);
}


}
