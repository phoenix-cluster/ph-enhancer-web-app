import { Component, OnInit } from '@angular/core';
import {ResultFile} from "./ResultFile";

export class ResultFileList{
    fileList: Array<ResultFile> = [];
    fileNameList: Array<string> = [];
    fileTypeList: Array<string> = [];
    fileListLength: number = 0;

    public isFileinList(fileName: string){
        return(this.fileNameList.indexOf(fileName) >=0);
    }

    public deleteFileByName(fileName: string):any{
        let i: number = this.fileNameList.indexOf(fileName);
        if(i < 0){
            return false;
        }

        this.fileList.splice(i, 1);
        this.fileNameList.splice(i, 1);
        this.fileTypeList.splice(i, 1);
    }

    public addFile(fileName:string, fileType:string){
        let file: ResultFile = new ResultFile(fileName, fileType);
        this.fileList.push(file);
        this.fileNameList.push(fileName);
        this.fileTypeList.push(fileType);
    }

}
