/**
 * Created by baimi on 2017/12/20.
 */


// truncate.ts
import {Pipe} from '@angular/core'

@Pipe({
    name: 'truncate'
})
export class TruncatePipe {
    transform(value: string, arg1: string, arg2:string) : string {
        let limit = arg1 != null ? parseInt(arg1, 10) : 10;
        let trail = arg2 != null  ? arg2 : '...';
        let truncatedString = value.length > limit ? value.substring(0, limit) + trail : value;
        return truncatedString;
    }
}
