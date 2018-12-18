import { Component, OnInit } from '@angular/core';

export class ResultFile{
    public fileName:string;
    public fileType:string = "none";
    constructor(fileName:string, fileType:string){
        this.fileName = fileName;
        this.fileType= fileType;
    }
}
