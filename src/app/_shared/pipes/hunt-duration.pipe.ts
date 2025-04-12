import { Pipe, PipeTransform } from "@angular/core";
import { HuntDate } from "@model";

@Pipe({
  name: 'huntDuration',
  standalone: true
})
export class HuntDurationPipe implements PipeTransform {
  transform(huntDates: HuntDate[]): number {
    if (huntDates) {
      return huntDates.reduce((totalDays, dateObj) => {
        const startDate = new Date(dateObj.start);
        const endDate = new Date(dateObj.end);
        const differenceInTime = endDate.getTime() - startDate.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        return totalDays + (differenceInDays + 1);
      }, 0);
    }
    return 0;
  }
}
