/**
 * Created by baimi on 2017/12/20.
 */

import {Page} from "./page";

/**
 * An array of data with an associated page object used for paging
 */
export class PagedData<T> {
    data = new Array<T>();
    page = new Page();
}
