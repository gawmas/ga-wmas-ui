import { Component, Input, ViewChild, inject, input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgIcon } from "@ng-icons/core";
import { Store } from "@ngrx/store";
import { HuntDurationPipe, MonthPipe, ObjectKeysPipe, OrdinalPipe, SafePipe, SuccessRateColorPipe, SuccessRatePipe, TrimTimePipe, WxConditionIconPipe } from "@pipes";
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
        SHARED_MODULES, DrawerComponent, HuntDurationPipe, ObjectKeysPipe,
        OrdinalPipe, WxConditionIconPipe, SafePipe, TrimTimePipe, NgIcon,
        SuccessRateColorPipe, SuccessRatePipe, WxDetailsSkeletonComponent, MonthPipe
    ]
})
export class WxDetailsComponent {

  @ViewChild('wxDetailsDrawer') wxDetailsDrawer: DrawerComponent | undefined;

  isAdmin = input.required<boolean>();

  private _store = inject(Store<AppStateInterface>);
  private _router = inject(Router);

  location = inject(Location);
  activatedRoute = inject(ActivatedRoute);

  wxDetailsTarget = 'wxDetailsDrawer';

  wxDetails$ = this._store.select(selectWxDetails);
  wxDetailsLoading$ = this._store.select(selectWxDetailsLoading);

  open() {
    this.wxDetailsDrawer?.open();
  }

  close(): void {
    this.wxDetailsDrawer?.close();
    const urlSegment = this.activatedRoute.snapshot.url[0];
    const returnRoute = urlSegment && urlSegment.path ? `/${urlSegment}` : '/';
    this._router.navigateByUrl(returnRoute, { replaceUrl: true })
  }

  showTooltip(targetElId: string, triggerType: TooltipTriggerType, event: any) {
    const targetEl = document.getElementById(targetElId)
    const tooltip = new Tooltip(targetEl, event.target as HTMLElement, { triggerType });
    tooltip.show();
  }

  visible(): boolean {
    return this.wxDetailsDrawer?.isOpen()!;
  }

}
