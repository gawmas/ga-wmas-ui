export interface Filter {
  skip: number;
  wmas?: number[] | null;
  seasons?: number[] | null;
  weapons?: number[] | null;
  successRate?: number | null;
  sort: string | null;
}
