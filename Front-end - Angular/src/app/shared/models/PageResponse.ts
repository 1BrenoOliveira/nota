export class PageResponse{
  content: any[];
  pageable: any;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  first: boolean;
  sort: {
    empty: boolean,
    sorted: boolean,
    unsorted: boolean
  };
  numberOfElements: number;
  empty: boolean;
}
