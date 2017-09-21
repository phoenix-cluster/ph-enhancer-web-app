import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-set-parameters',
  templateUrl: './set-parameters.component.html',
  styleUrls: ['./set-parameters.component.scss']
})
export class SetParametersComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  doAnalysis(){
    alert("Aye caption!")
  }

}
