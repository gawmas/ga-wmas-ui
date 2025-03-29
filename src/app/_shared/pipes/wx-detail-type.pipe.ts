import { Pipe, PipeTransform } from "@angular/core";
import { WxHistDetailedHunt, WxHistSummaryHunt } from "@model";

@Pipe({
  name: 'wxDetailType',
  standalone: true
})
export class WxDetailTypePipe implements PipeTransform {

  transform(value: WxHistSummaryHunt | WxHistDetailedHunt): string {
    if (this.isWxHistDetailedHunt(value)) {
      return 'detailed';
    } else if (this.isWxHistSummaryHunt(value)) {
      return 'summary';
    } else {
      return 'Unknown Type';
    }
  }

  private isWxHistDetailedHunt(obj: any): obj is WxHistDetailedHunt {
    return 'date' in obj && 'high' in obj && 'low' in obj && 'midday_descr' in obj && 'midday_icon' in obj && 'moon_illum' in obj && 'moon_phase' in obj;
  }

  private isWxHistSummaryHunt(obj: any): obj is WxHistSummaryHunt {
    return 'start' in obj && 'end' in obj && 'location' in obj && 'avgMaxTemp' in obj && 'avgMinTemp' in obj && 'maxTemp' in obj && 'minTemp' in obj;
  }
}
