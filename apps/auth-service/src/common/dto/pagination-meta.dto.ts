export class PaginationMetaDTO {
    page: number;
    pageSize: number;
    total: number;
    totalPage: number;

    constructor(page: number, pageSize: number, total: number) {
        this.page = page;
        this.pageSize = pageSize;
        this.total = total;
        this.totalPage = Math.ceil(total / pageSize);
    }
}