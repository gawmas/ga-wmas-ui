import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'isActiveRoute',
  standalone: true
})
export class IsActiveRoutePipe implements PipeTransform {
  transform(route: string, slug: string): boolean {
    return route === slug;
  }
}
