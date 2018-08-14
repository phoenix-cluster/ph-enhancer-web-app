import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModalDismissReasons, NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FileUploader, FileItem, ParsedResponseHeaders} from "ng2-file-upload";
import {Config} from "../../../../../model/config"
import {FileUploadService} from "../../../../../services/file-upload.service";
import {ResultFileList} from "../../../../../model/resultFileList";
import {Popup} from 'ng2-opd-popup';
import {AnalysisDataService} from "../../../../../services/analysis-data.service";

@Component({
    selector: 'app-upload-files',
    templateUrl: './upload-files.component.html',
    styleUrls: ['./upload-files.component.scss'],
})
export class UploadFilesComponent implements OnInit {
    analysisJobId: number;
    analysisJobToken:string;
    closeResult: string;
    uploadUrl = Config.baseUrl + "file/upload";
    public uploader: FileUploader;

    constructor(private modalService: NgbModal, private fileUploadService: FileUploadService,
                private popup:Popup, private analysisData:AnalysisDataService) {
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
        this.modalService.open(content, {windowClass: "hugeModal"}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
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
        this.initUploader();
        this.analysisData.currentAnalysisId.subscribe(analysisId => this.analysisJobId = analysisId);
    }

    //request an analysis id for next step to upload files
    // getAnalysisId() {
    //     this.fileUploadService.apply_an_analysis_id().then(
    //         id => {
    //             this.analysisJobId = id;
    //             console.log("got analysis id: " + this.analysisJobId);
    //             this.notify.emit(this.analysisJobId);
    //             this.uploader = new FileUploader({
    //                 url: this.uploadUrl,
    //                 isHTML5: true,
    //                 maxFileSize: 1000 * 1000 * 1000,
    //                 headers: [{name: 'myId', value: String(this.analysisJobId)}],
    //                 allowedMimeType: ['text/xml','application/x-gzip']
    //                 // allowedFileType: [".xml", ".xml.gz"]
    //             });
    //             this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    //             this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
    //             this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
    //                 form.append('myId', this.analysisJobId);
    //             };
    //
    //         }
    //     );
    // }
    //

    //initialize the uploader
    initUploader() {
        this.uploader = new FileUploader({
            url: this.uploadUrl,
            isHTML5: true,
            maxFileSize: 1000 * 1000 * 1000,
            // headers: [{name: 'myId', value: String(this.analysisJobId)}],
            allowedMimeType: ['text/xml', 'application/x-gzip']
            // allowedFileType: [".xml", ".xml.gz"]
        });
        this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
        this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
    }


    //check the files are in server or not
    confirmFiles() {

        if(this.uploader.queue.length <1){
            alert("You have not select any files.");
            return;
        }

        this.resultFileList = new ResultFileList();
        for (let i = 0; i < this.uploader.queue.length; i++) {
            let fileItem = this.uploader.queue[i];
            if (fileItem.isSuccess != true || fileItem.isUploaded != true) {
                alert("File " + fileItem.file.name + "is not uploaded or not success!")
                return;
            }
            if(this.resultFileList.fileList.indexOf(fileItem.file.name) >=0 ){
                alert("multiple files with same filename" + fileItem.file.name + ", the latest uploaded file will overwrite the previous ones.")
                continue;
            }
            this.resultFileList.fileList.push(fileItem.file.name);
        }
        this.resultFileList.fileListLength = this.uploader.queue.length;
        this.fileUploadService.conform_files(this.resultFileList, this.analysisJobId).then(
            status => {
                console.log(status)
            }
        )
    }

    public uploadItem(item: any) {
        if (this.analysisJobId == 0) {
            this.fileUploadService.apply_an_analysis_job().then(
                analysisJob => {
                    this.analysisJobId = analysisJob.id;
                    this.analysisData.changeAnalysisId(analysisJob.id);
                    this.analysisJobToken = analysisJob.token;
                    this.uploader.options.headers = [{name: 'myId', value: String(this.analysisJobId)}];
                    // alert("Your analysis job id is :" + this.analysisJobId + ", please remember this id and use it for help or result checking");
                    this.popup.show();
                    item.upload();
                })
        }else{
            item.upload();
        }
    }

    public uploadAll() {
        if (this.analysisJobId == 0) {
            this.fileUploadService.apply_an_analysis_job().then(
                analysisJob => {
                    this.analysisJobId = analysisJob.id;
                    this.analysisData.changeAnalysisId(analysisJob.id);
                    this.analysisJobToken = analysisJob.token;
                    this.uploader.options.headers = [{name: 'myId', value: String(this.analysisJobId)}];
                    // alert("Your analysis job id is :" + this.analysisJobId + ", please remember this id and use it for help or result checking");
                    this.popup.show();
                    this.uploader.uploadAll();
                })
        }else{
            this.uploader.uploadAll();
        }
    }

    public popupConfirmEvent(){
        this.popup.hide();
    }

    public popupCancelEvent(){
        this.popup.hide();
    }

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
