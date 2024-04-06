import { Component, Input, ViewChild, inject } from "@angular/core";
import { Hunt, HuntDate } from "@model";
import { NgIcon } from "@ng-icons/core";
import { Store } from "@ngrx/store";
import { MonthPipe, OrdinalPipe, SafePipe, SuccessRateColorPipe, SuccessRatePipe, TrimTimePipe, WxConditionIconPipe } from "@pipes";
import { SHARED_MODULES } from "@shared-imports";
import { AppStateInterface } from "@store-model";
import { LoadingComponent } from "_shared/components/loading.component";
import { ModalComponent } from "_shared/components/modal.component";
import { Tooltip, TooltipTriggerType } from "flowbite";
import { selectWxDetails, selectWxDetailsLoading } from "store/wxDetails/wxDetails.selectors";
import { WxDetailsSkeletonComponent } from "./wxDetails-skeleton.component";

@Component({
  selector: 'gawmas-wx-details',
  standalone: true,
  templateUrl: './wxDetails.component.html',
  imports: [
    SHARED_MODULES, ModalComponent, LoadingComponent,
    OrdinalPipe, WxConditionIconPipe, SafePipe, TrimTimePipe, NgIcon,
    SuccessRateColorPipe, SuccessRatePipe, WxDetailsSkeletonComponent, MonthPipe]
})
export class WxDetailsComponent {

  @Input() huntId: string | undefined;
  @ViewChild('wxDetailsModal') wxDetailsModal: ModalComponent | undefined;

  private _store = inject(Store<AppStateInterface>);

  wxDetailsTarget = 'wxDetailsModal';
  huntDates: HuntDate[] | undefined;
  location: string | undefined;
  hunt: Partial<Hunt> | undefined;
  duration: number | undefined = 3;

  wxDetails$ = this._store.select(selectWxDetails);
  wxDetailsLoading$ = this._store.select(selectWxDetailsLoading);

  dateKeys(data: any) {
    return Object.keys(data);
  }

  open(huntDates: HuntDate[], location: string, hunters: number, does: number, bucks: number) {

    this.huntDates = huntDates;
    this.location = location;

    this.duration = this.huntDates.reduce((totalDays, dateObj) => {
      const startDate = new Date(dateObj.start);
      const endDate = new Date(dateObj.end);
      const differenceInTime = endDate.getTime() - startDate.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      return totalDays + (differenceInDays + 1);
    }, 0);

    this.hunt = { hunterCount: hunters, does, bucks };

    this.wxDetailsModal?.open();
  }

  close(): void {
    this.wxDetailsModal?.close();
  }

  showTooltip(targetElId: string, triggerType: TooltipTriggerType, event: any) {
    const targetEl = document.getElementById(targetElId)
    const tooltip = new Tooltip(targetEl, event.target as HTMLElement, { triggerType });
    tooltip.show();
  }

}
