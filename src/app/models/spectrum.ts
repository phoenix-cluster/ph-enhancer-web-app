import { Component, OnInit } from '@angular/core';

export class Spectrum {

  static spectrumHeaders = [
    {"headName":"libSpectrumTitle", "order":"False"},
    {"headName":"peptide", "order":"False"},
    {"headName":"charge", "order":"True"},
    {"headName":"precursorMZ", "order":"True"},
  ];

  private id:number;
  private libSpectrumTitle:string;
  private peptide:string;
  private charge:number;
  private precursorMZ:number;
}
