export class PageOfLogFile {
    constructor(lines: string[], startLineNo: number, endLineNo: number, length: number) {
        this.lines = lines;
        this.startLineNo = startLineNo;
        this.endLineNo = endLineNo;
        this.length = length;
    }
    lines : string[];
    startLineNo: number;
    endLineNo: number;
    length: number;
}