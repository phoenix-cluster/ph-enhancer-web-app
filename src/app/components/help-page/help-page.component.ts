import { Component, OnInit } from '@angular/core';

import "../../../assets/js/helppage/jquery.min.js";
import "../../../assets/js/helppage/prettify/prettify.js";
import "../../../assets/js/helppage/jquery.localscroll-1.2.7.js";
import "../../../assets/js/helppage/jquery.scrollTo-1.4.3.1.js";
// import "../../../assets/js/helppage/layout.js";



@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.scss']
})
export class HelpPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

    onHashtagClick(hashtagName:string){
        let x = document.querySelector("#" + hashtagName);
        if (x){
            x.scrollIntoView();
            window.scrollBy(0, -150);
        }
    }

}
