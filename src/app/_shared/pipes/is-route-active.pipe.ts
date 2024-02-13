import { Pipe, PipeTransform } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Pipe({
  name: 'isActiveRoute',
  standalone: true
})
export class IsActiveRoutePipe implements PipeTransform {
  transform(route: string, slug: string): boolean {
    return route === slug;
  }
}
