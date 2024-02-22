export interface Filter {
  skip: number;
  pageSize?: number | null;
  wmas?: number[] | null;
  seasons?: number[] | null;
  weapons?: number[] | null;
  successRate?: number | null;
  isBonusQuota?: boolean | null;
  isStatePark?: boolean | null;
  isVpa?: boolean | null;
  sort: string | null;
}
