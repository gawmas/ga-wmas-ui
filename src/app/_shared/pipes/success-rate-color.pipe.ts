import { Pipe } from "@angular/core";
import { Hunt } from "@model";

@Pipe({ name: 'successRateColor', standalone: true })
export class SuccessRateColorPipe {
  transform(hunt: Hunt) {
    if (hunt.hunterCount === null) return 'text-stone-300';
    const perc = ((hunt.bucks ?? 0) + (hunt.does ?? 0)) / (hunt.hunterCount ?? 0) * 100;
    if (perc >= 50) {
      return 'text-lime-400';
    } else if (perc >= 25 && perc < 50) {
      return 'text-yellow-400';
    } else {
      return 'text-stone-300';
    }
  }
}
