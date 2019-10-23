/**
 * Created by baimi on 2017/12/20.
 */


/**
 * Created by baimi on 2017/12/20.
 */


import {Pipe} from '@angular/core'

@Pipe({
    name: 'spec_title2list'
})
export class SpecTitle2ListPipe {
    transform(value: string) : string[] {
        return value.split("||");
    }
}