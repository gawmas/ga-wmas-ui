import { Pipe, PipeTransform } from "@angular/core";
import { Season, Weapon, Wma } from "@model";

@Pipe({
  name: 'filterObjName',
  standalone: true
})
export class FilterObjNamePipe implements PipeTransform {

  transform(idValue: number, collection: Wma[] | Season[] | Weapon[]): string {
    const item: Wma | Season | Weapon | undefined = collection.find((obj) => obj.id === idValue);
    if (item?.hasOwnProperty('season')) {
      return (item as Season).season;
    } else if (item?.hasOwnProperty('name')) {
      return (item as Wma | Weapon).name;
    } else {
      return '';
    }
    return '';
  }

}
