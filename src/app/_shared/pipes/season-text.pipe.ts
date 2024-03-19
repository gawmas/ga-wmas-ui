import { Pipe, PipeTransform } from "@angular/core";
import { Season } from "@model";

@Pipe({
  name: "seasonText",
  standalone: true
})
export class SeasonTextPipe implements PipeTransform {
  transform(seasons: Season[], seasonId: string): string {
    return seasons.find(s => s.id === +seasonId)?.season || '';
  }
}
