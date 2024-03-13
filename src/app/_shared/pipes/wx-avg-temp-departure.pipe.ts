import { Pipe, PipeTransform, inject } from "@angular/core";
import { WxHistAverageTemps } from "@model";

@Pipe({
  name: 'wxAvgTempDeparture',
  standalone: true
})
export class WxAvgTempDeparturePipe implements PipeTransform {

  transform(value: number, isHigh: boolean, startDate: string, avgs: WxHistAverageTemps[]): { class: string, msg: string | null } {
    const avgTempObj: WxHistAverageTemps = avgs.find((avg: any) => avg.startDate === startDate) as unknown as WxHistAverageTemps;

    if (avgTempObj) {
      const departure = isHigh ?
        Math.round(value - avgTempObj.avgHigh) :
        Math.round(value - avgTempObj.avgLow);

      let colorClass = '';

      const classMap = {
        'text-red-700': departure >= 15,
        'text-cyan-700': departure <= -15,
        'text-red-500': departure >= 10 && departure < 15,
        'text-cyan-500': departure <= -10 && departure < -15,
        'text-red-300': departure >= 5 && departure < 10,
        'text-cyan-300': departure <= -5,
        'text-gray-200': departure < 5
      };

      for (const [key, value] of Object.entries(classMap)) {
        if (value) {
          colorClass = key;
          break;
        }
      }

      const extractColorAndValue = (inputString: string) => {
        const regex = /text-(red|cyan)-(\d+)$/;
        const match = inputString.match(regex);
        if (match && match[1] && match[2]) {
          return {
            color: match[1],
            value: parseInt(match[2])
          };
        } else {
          return null;
        }
      }

      let text = '';

      if (colorClass) {
        switch (extractColorAndValue(colorClass)?.value) {
          case 700:
            text = 'Significantly';
            break;
          case 500:
            text = 'Moderately';
            break;
          case 300:
            text = 'Slightly';
            break;
          default:
            text = '';
            break;
        }
        if (extractColorAndValue(colorClass)?.color === 'red') {
          text += ' warmer';
        } else if (extractColorAndValue(colorClass)?.color === 'cyan') {
          text += ' cooler';
        } else {
          text = '';
        }

        let avgTemp = '';
        if (isHigh) {
          avgTemp = avgTempObj.avgHigh.toString();
        } else {
          avgTemp = avgTempObj.avgLow.toString();
        }

        return {
          class: colorClass,
          msg: `${text} than average temperatures for period. Historical average ${isHigh ? 'high' : 'low'}: ${avgTemp}&deg;` };

      }

    }

    return { class: 'text-gray-200', msg: null };
  }
}
