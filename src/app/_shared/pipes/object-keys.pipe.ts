import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'objKeys',
  standalone: true
})
export class ObjectKeysPipe implements PipeTransform {
  transform(value: any): string[] {
    return Object.keys(value);
  }
}
