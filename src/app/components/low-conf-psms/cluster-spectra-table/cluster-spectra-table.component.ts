import { Component, OnInit } from '@angular/core';
import {Spectrum} from "../../../models/spectrum";
import {SpectrumTableService} from "../../../services/spectra-tabel.service";

@Component({
  selector: 'app-cluster-spectra-table',
  templateUrl: './cluster-spectra-table.component.html',
  styleUrls: ['./cluster-spectra-table.component.scss']
})
export class ClusterSpectraTableComponent implements OnInit {
  private spectrumHeaders = Spectrum.spectrumHeaders;

  constructor(
    private spectrumTableService:SpectrumTableService,
  ){  }

  // spectra : Spectrum[];
  // spectrumMap = new Map<string, Spectrum>();
  spectrumTitles: string[];
  spectrumTable = new Array<Spectrum>();

  getSpectra(): void {
    this.spectrumTableService.getSpectra().then(spectra => {this.spectrumTable = spectra});
    // this.spectrumTableService.getSpectraTitleList(10).then(spectrumTitles => {this.spectrumTitles = spectrumTitles; this.writeSpectrumTable()});
  }

  ngOnInit() {
    this.getSpectra();
  }

  getClassByOrder(order:string): string{
    switch (order){
      case 'False':{
        return '';
      }
      case 'asc':{
        return 'fa-sort-up';
      }
      case 'desc':{
        return 'fa-sort-down';
      }
    }
  }

  onAcceptClick(checkBoxId:string): void {
    let checkBox: HTMLInputElement = <HTMLInputElement> document.getElementById(checkBoxId);
    if (checkBox.readOnly) checkBox.checked=checkBox.readOnly=false;
    else if (!checkBox.checked) checkBox.readOnly=checkBox.indeterminate=true;
  }

  setIndeterminate(checkBoxId:string): void{
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

}
