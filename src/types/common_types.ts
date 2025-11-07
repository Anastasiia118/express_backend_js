
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export type PaginationAndSorting<S> = {
  pageNumber: number;
  pageSize: number;
  sortBy: S;
  sortDirection: SortDirection;
};