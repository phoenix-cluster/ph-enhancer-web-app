/**
 * Created by baimi on 2017/12/19.
 */

/**
 * https://github.com/swimlane/ngx-datatable/blob/master/demo/paging/model/page.ts
 * An object used to get page information from the server
 */
export class Page {
    //The number of elements in the page
    size: number = 10;
    //The current page number
    pageNumber: number = 1;
    //The total number of elements
    totalElements: number = 0;
    //The total number of pages
    totalPages: number = 0;

    sortField:string = 'confidentScore';

    sortDirection:string = 'asc';

}
