/**
 * Created by baimi on 2017/12/20.
 */


// truncate.ts
import {Pipe} from '@angular/core'

@Pipe({
    name: 'truncate_clusterid'
})
export class TruncateClusterIdPipe {
    transform(value: string, args: string[]) : string {
        let limit = 6;
        let trail = '...';
        if (args != null) {
            limit = args.length > 0 ? parseInt(args[0]) : 6;
            trail = args.length > 1 ? args[1] : '...';
        }

        return value.slice(0,limit) + trail + value.slice(-limit);
    }
}
