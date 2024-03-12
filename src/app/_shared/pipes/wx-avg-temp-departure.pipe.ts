import { Pipe, PipeTransform, inject } from "@angular/core";
import { WxHistAverageTemps } from "@model";

@Pipe({
  name: 'wxAvgTempDeparture',
  standalone: true
})
export class WxAvgTempDeparturePipe implements PipeTransform {

  transform(value: number, isHigh: boolean, startDate: string, avgs: WxHistAverageTemps[]): string {
    const avgTempObj: WxHistAverageTemps = avgs.find((avg: any) => avg.startDate === startDate) as unknown as WxHistAverageTemps;
    if (avgTempObj) {
      const departure = isHigh ? Math.round(avgTempObj.avgHigh - value) : Math.round(avgTempObj.avgLow - value);
      const higherThanNormal = departure > 0;

      let colorClass = '';
      if (Math.abs(departure) >= 15) {
        colorClass = higherThanNormal ? 'text-red-700' : 'text-cyan-700';
      } else if (Math.abs(departure) < 15 && Math.abs(departure) >= 10) {
        colorClass = higherThanNormal ? 'text-red-500' : 'text-cyan-500';
      } else if (Math.abs(departure) < 10 && Math.abs(departure) >= 5) {
        colorClass = higherThanNormal ? 'text-red-300' : 'text-cyan-300';
      } else {
        colorClass = 'text-gray-200';
      }

      return colorClass;
    }
    return 'text-gray-200';
  }
}
