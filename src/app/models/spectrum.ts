import { Component, OnInit } from '@angular/core';

export class Spectrum {

  static spectrumHeaders = [
    {"headName":"title", "order":"False"},
    {"headName":"charge", "order":"True"},
    {"headName":"precursorMz", "order":"True"},
  ];

  title:string;
  charge:number;
  recommPepSeq:string;
  precursorMz:number;
  peaklistMz:number[];
  peaklistIntens:number[];

  constructor(title: string, charge: number, precursorMz: number) {
    this.title = title;
    this.charge = charge;
    this.precursorMz = precursorMz;
  }


  // get title(): string {
  //   return this.title;
  // }
}
