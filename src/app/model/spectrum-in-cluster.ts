import { Component, OnInit } from '@angular/core';

export class SpectrumInCluster {

  static spectrumInClusterHeaders = [
    {"headName":"title", "order":"False"},
    {"headName":"sequence", "order":"False"},
    {"headName":"charge", "order":"True"},
    {"headName":"precursorMz", "order":"True"},
  ];

  private id:number;
  private title:string;
  private sequence:string;
  private charge:number;
  private precursorMz:number;
}
