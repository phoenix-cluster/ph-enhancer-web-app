/**
 * Created by baimi on 2017/12/20.
 */


// truncate.ts
import {Pipe} from '@angular/core'

@Pipe({
    name: 'shortnumber'
})
export class ShortNumberPipe {
    transform(value: number) : string {
        let precision = 0, minimum = 1000;
        if (isNaN( value ))
            return value.toString();
        if (value < minimum)
            return value.toFixed(precision);

        let powerOfTen = Math.floor(Math.log(Math.abs(value)) * Math.LOG10E);
        let result = null;
        switch(powerOfTen) {
            case 3:  case 4: case 5:
                result = (value / Math.pow(10, 3)).toFixed(precision) + ' k';
                break;
            case 6:  case 7: case 8:
                result = (value / Math.pow(10, 6)).toFixed(precision) + ' m';
                break;
            case 9:  case 10: case 11:
                result = (value / Math.pow(10, 9)).toFixed(precision) + ' b';
                break;
            case 12: case 13: case 14:
                result = (value / Math.pow(10, 12)).toFixed(precision) + ' t';
                break;
            default :
                result = value.toFixed(precision);
        }
        return result;
    }
}
