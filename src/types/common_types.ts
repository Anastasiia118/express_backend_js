
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export type PaginationAndSorting<S> = {
  pageNumber: number;
  pageSize: number;
  sortBy: S;
  sortDirection: 1 | -1;
};

export interface IPagination<I> {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: I
}