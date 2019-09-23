/**
 * created by Ricardo on 2018.6.7
 */


// import jQuery from 'jquery';
import $ from 'jquery';

import "./lorikeet/jquery.flot.js";
import "./lorikeet/jquery.flot.selection.js";
import "./lorikeet/peptide.js";
import "./lorikeet/aminoacid.js";
import "./lorikeet/ion.js";
import "./lorikeet/specview.js";

import {SpecviewOption} from "../../model/specview-option"

export class Specview {
    private selector: string;
    private option: SpecviewOption;
    constructor(selector: string, option: SpecviewOption) {
        this.selector = selector;
        this.option = option;
    }
    refresh() {
        if(!this.selector || !this.option) {
            this.handleError();
            return;
        }
        $(this.selector).specview(this.option);
    }
    set setSelector(s: string) {
        this.selector = s;
    }
    set setSpecOpt(o: SpecviewOption) {
        this.option = o;
    }

    handleError() {
        console.log("incorrect lorikeet selector or option");
    }
}
