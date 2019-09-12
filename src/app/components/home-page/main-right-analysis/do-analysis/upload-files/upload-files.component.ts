import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDismissReasons, NgbActiveModal, NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {FileUploader, FileItem, ParsedResponseHeaders} from "ng2-file-upload";
import {environment} from "../../../../../../environments/environment"
import {FileUploadService} from "../../../../../services/file-upload.service";
import {ResultFileList} from "../../../../../model/resultFileList";
import {Popup} from 'ng2-opd-popup';
import {AnalysisDataService} from "../../../../../services/analysis-data.service";
import {ConfigService} from "../../../../../services/config.service";
import {AnalysisJob} from "../../../../../model/analysisJob";
import {queue} from "rxjs/scheduler/queue";

@Component({
    selector: 'app-upload-files',
    templateUrl: './upload-files.component.html',
    styleUrls: ['./upload-files.component.scss'],
})
export class UploadFilesComponent implements OnInit {
    analysisJob:AnalysisJob;
    analysisJobId: number;
    analysisJobToken:string;
    fileUploadEnabled:boolean;
    closeResult: string;
    uploadUrl : string;
    allowedFileType : any;
    public uploader: FileUploader;
    modalReference:NgbModalRef;

    constructor(private modalService: NgbModal, private fileUploadService: FileUploadService,
                 private analysisData:AnalysisDataService, private  configService:ConfigService) {
        this.analysisJobId = 0;
    }

    public hasBaseDropZoneOver: boolean = false;
    public hasAnotherDropZoneOver: boolean = false;
    private resultFileList: ResultFileList;

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public fileOverAnother(e: any): void {
        this.hasAnotherDropZoneOver = e;
    }

    open(content) {
        this.modalReference = this.modalService.open(content, {windowClass: "hugeModal"});
        this.modalReference.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    openJobIdPopup(analysisIdPopup) {
        this.modalService.open(analysisIdPopup, {windowClass: "hugeModal"}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    openConfirmPopup(confirmPopup) {

    }


    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    ngOnInit() {
        this.configService.getConfig().then(configJson  => {
            this.uploadUrl = configJson.analysisBaseUrl+ "file/upload";
            this.allowedFileType = configJson.allowedFileType;
            this.initUploader();
            });
        this.analysisData.currentAnalysisJob.subscribe(analysisJob => {this.analysisJob = analysisJob;
            if(this.analysisJob != null) {
                this.analysisJobId = analysisJob.id
            }});
        this.analysisData.currentAnalysisToken.subscribe(analysisToken => this.analysisJobToken = analysisToken);
        this.analysisData.currentFileUploadEnabled.subscribe(fileUploadEnabled=> this.fileUploadEnabled= fileUploadEnabled);
    }


    //initialize the uploader
    initUploader() {
        this.uploader = new FileUploader({
            url: this.uploadUrl,
            isHTML5: true,
            maxFileSize: 1000 * 1000 * 1000,
            // headers: [{name: 'myId', value: String(this.analysisJobId)}],
            // allowedMimeType: ['text/xml', 'application/x-gzip']
            // allowedFileType: ['xml', 'xml.gz']
            // allowedFileType: ['image', 'pdf', 'txt', 'doc', 'xml', 'mzid', 'mgf']
            // allowedFileType: environment.allowedFileType;
        });
        this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
        this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
        this.resultFileList = new ResultFileList();
        this.uploader.onAfterAddingFile = (fileItem: FileItem) => this.onAfterAddingFile(fileItem)
        // this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
        //     console.log(response);// the url will be in the response
        // };
    }


    //check the files are in server or not
    confirmFiles() {
        if (this.uploader.queue.length < 1) {
            alert("You have not select any files.");
            return;
        }
        this.confirmFilesForSure();
    }

    //check file types
    isFileTypesSet(){
        console.log(this.uploader, queue);
        for (let i = 0; i < this.uploader.queue.length; i++) {
            let fileItem = this.uploader.queue[i];
            //we only use headers[0] to store the information here
            if (fileItem.headers.length !=1 || !("filetype" in fileItem.headers[0]) || fileItem.headers[0]["filetype"] == "none"){
                console.log(fileItem);
                alert("Please set the file type for file" + ": " + (i+1) +" " + fileItem.file.name)
                return false;
            }
            console.log(fileItem)
        }
        return true;
    }

    confirmFilesForSure(){
        // this.popup2.hide();

        if(!this.isFileTypesSet()){
            return;
        }

        for (let i = 0; i < this.uploader.queue.length; i++) {
            let fileItem = this.uploader.queue[i];
            if (fileItem.isSuccess != true || fileItem.isUploaded != true) {
                alert("File " + fileItem.file.name + "is not uploaded or not success!")
                return;
            }
            if(this.resultFileList.isFileinList(fileItem.file.name) ){
                alert("multiple files with same filename" + fileItem.file.name + ", the latest uploaded file will overwrite the previous ones.")
                continue;
            }
            this.resultFileList.addFile(fileItem.file.name,fileItem.headers[0]["filetype"] );
        }
        this.uploader.options.disableMultipart = true;
        this.uploader.options.allowedMimeType = [];
        this.analysisData.changeFileUploadEnabled(false);
        console.log(this.resultFileList);
        this.resultFileList.fileListLength = this.uploader.queue.length;
        this.fileUploadService.conform_files(this.resultFileList, this.analysisJobId).then(
            status => {
                console.log(status)
            }
        )
        this.modalReference.close();
    }

    public uploadItem(item: any, analysisIdPopup:any) {

        if(!this.isFileTypesSet()){
            return;
        }

        if (this.analysisJobId == 0) {
            this.fileUploadService.apply_an_analysis_job().then(
                analysisJob => {
                    console.log(analysisJob);
                    this.analysisJob = this.analysisJob;
                    this.analysisJobId = analysisJob.id;
                    this.analysisData.changeAnalysisJob(analysisJob);
                    this.analysisJobToken = analysisJob.token;
                    this.analysisData.changeAnalysisToken(analysisJob.token);
                    console.log(this.analysisJob.accessionId);
                    this.uploader.options.headers = [{name: 'analysisId', value: String(this.analysisJob.id)},
                                                     {name: 'token', value: String(this.analysisJobToken)},
                                                     {name: 'accessionId', value: String(this.analysisJob.accessionId)}];
                    // alert("Your analysis job id is :" + this.analysisJobId + ", please remember this id and use it for help or result checking");
                    // this.popup1.show();
                    // this.openJobIdPopup(analysisIdPopup);
                    item.upload();
                })
        }else{
            this.uploader.options.headers = [{name: 'analysisId', value: String(this.analysisJob.id)},
                {name: 'token', value: String(this.analysisJobToken)},
                {name: 'accessionId', value: String(this.analysisJob.accessionId)}];
            console.log(this.uploader.options.headers)
            item.upload();
        }
    }

    public uploadAll(analysisIdPopup:any) {

        if(!this.isFileTypesSet()){
            return;
        }

        if (this.analysisJobId == 0) {
            this.fileUploadService.apply_an_analysis_job().then(
                analysisJob => {
                    this.analysisJobId = analysisJob.id;
                    this.analysisJob = this.analysisJob;
                    this.analysisData.changeAnalysisJob(analysisJob);
                    this.analysisJobToken = analysisJob.token;
                    this.analysisData.changeAnalysisToken(analysisJob.token);
                    this.uploader.options.headers = [{name: 'analysisId', value: String(this.analysisJob.id)},
                        {name: 'token', value: String(this.analysisJobToken)},
                        {name: 'accessionId', value: String(this.analysisJob.accessionId)}];
                    // alert("Your analysis job id is :" + this.analysisJobId + ", please remember this id and use it for help or result checking");
                    // this.popup1.show();
                    // this.openJobIdPopup(analysisIdPopup);
                    this.uploader.uploadAll();
                })
        }else{
            this.uploader.options.headers = [{name: 'analysisId', value: String(this.analysisJob.id)},
                {name: 'token', value: String(this.analysisJobToken)},
                {name: 'accessionId', value: String(this.analysisJob.accessionId)}];
            this.uploader.uploadAll();
        }
    }

    public uploadFileTypeChange(value:any, item:FileItem){
        item.headers.push({"filetype":value});
        console.log(item.headers[0]);
    }


    private isFileAllowed(fileName:String):boolean{
        let fileExt = "";
        let splitList = fileName.split('.');
        if (splitList[splitList.length - 1] == 'gz'){
            fileExt =  splitList[splitList.length - 2];
        }else{
            fileExt = splitList[splitList.length - 1];
        }
        if (this.allowedFileType.indexOf(fileExt) >= 0){
            return true;
        }else{
            return false;
        }
    }

    onAfterAddingFile(fileItem: FileItem) {
        var filename = fileItem.file.name;
        if(!this.isFileAllowed(filename)){
            this.uploader.removeFromQueue(fileItem);
        }
    }


    // public popupConfirmEvent(){
    //     this.popup1.hide();
    // }
    //
    // public popupCancelEvent(){
    //     this.popup1.hide();
    // }


    onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
        console.log(response)
//        let data = JSON.parse(response); //success server response
//         console.log(data)
    }


    onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
        console.log(response)
        // let error = JSON.parse(response); //error server response
        // console.log(error)
    }


}
