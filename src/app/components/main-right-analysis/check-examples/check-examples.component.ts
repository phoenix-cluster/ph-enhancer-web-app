import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-check-examples',
  templateUrl: './check-examples.component.html',
  styleUrls: ['./check-examples.component.scss']
})
export class CheckExamplesComponent implements OnInit {

  constructor() { }
  colorSelect: Array<any>;

  ngOnInit() {
    this.colorSelect = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' },
      { value: '4', label: 'Option 4' },
      { value: '5', label: 'Option 5' },
    ];
  }

}
