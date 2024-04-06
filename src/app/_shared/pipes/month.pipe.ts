import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'month',
  standalone: true
})
export class MonthPipe implements PipeTransform {
  transform(month: string): Date {
    return new Date(2024, parseInt(month) - 1, 1);
  }
}
