import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'trimTime',
  standalone: true
})
export class TrimTimePipe implements PipeTransform {
  transform(value: string) {
    if (value.charAt(0) === '0') {
      return value.substring(1);
    }
    return value;
  }
}
