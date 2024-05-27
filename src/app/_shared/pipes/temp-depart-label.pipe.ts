import { Pipe } from "@angular/core";

@Pipe({
  name: 'tempDepartLabel',
  standalone: true
})
export class TempDepartLabelPipe {
  transform(value: number): string {
    switch (value) {
      case 2:
        return 'Significantly warmer than average.';
        break;
      case 1:
        return 'Slightly warmer than average.';
        break;
      case -1:
        return 'Slightly cooler than average.';
        break;
      case -2:
        return 'Significantly cooler than average.';
        break;
      default:
        return '';
        break;
    }
  }
}
