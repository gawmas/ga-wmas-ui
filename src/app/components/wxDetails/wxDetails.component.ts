import { Component, Input, ViewChild, inject } from "@angular/core";
import { Hunt, HuntDate } from "@model";
import { NgIcon } from "@ng-icons/core";
import { Store } from "@ngrx/store";
import { MonthPipe, OrdinalPipe, SafePipe, SuccessRateColorPipe, SuccessRatePipe, TrimTimePipe, WxConditionIconPipe } from "@pipes";
import { SHARED_MODULES } from "@shared-imports";
import { AppStateInterface } from "@store-model";
import { Tooltip, TooltipTriggerType } from "flowbite";
import { selectWxDetails, selectWxDetailsLoading } from "store/wxDetails/wxDetails.selectors";
import { WxDetailsSkeletonComponent } from "./wxDetails-skeleton.component";
import { DrawerComponent } from "_shared/components/drawer.component";
import { Location } from "@angular/common";

@Component({
    selector: 'gawmas-wx-details',
    templateUrl: './wxDetails.component.html',
    imports: [
        SHARED_MODULES, DrawerComponent,
        OrdinalPipe, WxConditionIconPipe, SafePipe, TrimTimePipe, NgIcon,
        SuccessRateColorPipe, SuccessRatePipe, WxDetailsSkeletonComponent, MonthPipe
    ]
})
export class WxDetailsComponent {

  @Input() huntId: string | undefined;
  @ViewChild('wxDetailsDrawer') wxDetailsDrawer: DrawerComponent | undefined;

  private _store = inject(Store<AppStateInterface>);
  private _location = inject(Location);

  wxDetailsTarget = 'wxDetailsDrawer';
  huntDates: HuntDate[] | undefined;
  location: string | undefined;
  hunt: Partial<Hunt> | undefined;
  duration: number | undefined = 3;

  wxDetails$ = this._store.select(selectWxDetails);
  wxDetailsLoading$ = this._store.select(selectWxDetailsLoading);

  dateKeys(data: any) {
    return Object.keys(data);
  }

  open(huntDates: HuntDate[], location: string, hunters: number, does: number, bucks: number, weapon: string) {

    this.huntDates = huntDates;
    this.location = location;

    this.duration = this.huntDates.reduce((totalDays, dateObj) => {
      const startDate = new Date(dateObj.start);
      const endDate = new Date(dateObj.end);
      const differenceInTime = endDate.getTime() - startDate.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      return totalDays + (differenceInDays + 1);
    }, 0);

    this.hunt = { hunterCount: hunters, does, bucks, weapon };

    this.wxDetailsDrawer?.open();
  }

  close(): void {
    this.wxDetailsDrawer?.close();
  }

  showTooltip(targetElId: string, triggerType: TooltipTriggerType, event: any) {
    console.log('targetElId', targetElId, 'target', event.target as HTMLElement);
    const targetEl = document.getElementById(targetElId)
    const tooltip = new Tooltip(targetEl, event.target as HTMLElement, { triggerType });
    console.log(tooltip);
    tooltip.show();
  }

}
