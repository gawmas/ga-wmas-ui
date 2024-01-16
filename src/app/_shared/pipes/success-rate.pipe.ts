import { Pipe } from '@angular/core';
import { Hunt } from '@model';

@Pipe({ name: 'successRate', standalone: true })
export class SuccessRatePipe {
  transform(hunt: Hunt): string {
    if (hunt.hunterCount === null) return '0';
    const perc = ((hunt.bucks ?? 0) + (hunt.does ?? 0)) / (hunt.hunterCount ?? 0) * 100;
    const value = parseFloat(perc.toString()).toFixed(2);
    return value.substring(value.indexOf('.') + 1, value.length) === '00' ?
      value.substring(0, value.indexOf('.')) : value;
  }
}
