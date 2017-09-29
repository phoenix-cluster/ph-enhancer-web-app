import { Component, OnInit } from '@angular/core';
import {Psm} from '../../../models/psm'
import {PsmTableService} from '../../../services/psm-tabel.service'

@Component({
  selector: 'app-psm-tables',
  templateUrl: './psm-tables.component.html',
  styleUrls: ['./psm-tables.component.scss']
})
export class PsmTablesComponent implements OnInit {


  private psmHeaders = Psm.psmHeaders;

  constructor(
    private psmTableService:PsmTableService,
  ){  }

  psms : Psm[];
  psmMap = new Map<string, Psm>();
  psmTitles: string[];
  psmTable = new Array<Psm>();

  getPsms(): void {
    this.psmTableService.getPsms().then(psms => {for(let psm of psms) this.psmMap.set(psm['querySpectrumTitle'], psm)});
    this.psmTableService.getPsmTitleList(10).then(psmTitles => {this.psmTitles = psmTitles; this.writePsmTable()});
  }

  ngOnInit() {
    this.getPsms();
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
   *  based on the psmTitles, which comes from the server
   */
  writePsmTable():void{
    this.psmTable = [];
    for(var psmTitle of this.psmTitles){
      this.psmTable.push(this.psmMap.get(psmTitle))
    }
}

  rewritePsmTablebyPageSize(pageSize:number):void{
    alert(pageSize);
    this.psmTableService.getPsmTitleList(pageSize).then(psmTitles => {this.psmTitles = psmTitles; this.writePsmTable()});
  }

}
