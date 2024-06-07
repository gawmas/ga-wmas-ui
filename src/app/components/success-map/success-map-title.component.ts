import { Component, inject } from "@angular/core";
import { NgIconComponent } from "@ng-icons/core";
import { Store } from "@ngrx/store";
import { SeasonTextPipe } from "@pipes";
import { SHARED_MODULES } from "@shared-imports";
import { AppStateInterface } from "@store-model";
import { Tooltip, TooltipTriggerType } from "flowbite";
import * as successMapSelectors from 'store/successMap/successMap.selectors';

@Component({
  selector: 'gawmas-success-map-title',
  standalone: true,
  imports: [SHARED_MODULES, SeasonTextPipe, NgIconComponent],
  template: `
    <div class="w-full flex items-center justify-between">
      <button class="md:invisible btn btn-map-ctrl primary m-1">
        <ng-icon name="heroAdjustmentsHorizontal" class="text-lg" />
        <div class="count-badge">1</div>
      </button>
      <h3 class="mb-1 mt-0 py-1 md:flex md:items-center justify-center text-sm md:text-xl font-bold">
        <span class="chip result-chip chip-season text-xs md:text-sm ml-1">
          {{ (seasons$ | async)! | seasonText:(selectedSeasons | async)?.toString() ?? '' }}
        </span>
        <span class="italic ml-2 mt-1 md:mt-0 tracking-widest block md:inline-block">
          {{ mapTitle$ | async }}</span>
      </h3>
      <button class="btn btn-map-ctrl" (mouseover)="showLegendTooltip('legendBtn', 'hover', $event)">
        <ng-icon name="heroListBullet" class="text-lg" />
        <div id="legendBtn" role="tooltip" class="gawmas-tooltip tooltip">
          <span>Legend</span>
          <div class="tooltip-arrow" data-popper-arrow></div>
        </div>
      </button>
    </div>
  `
})
export class SuccessMapTitleComponent {

  private _store = inject(Store<AppStateInterface>);

  mapTitle$ = this._store.select(successMapSelectors.selectMapTitle);
  seasons$ = this._store.select(successMapSelectors.selectSeasons);
  selectedSeasons = this._store.select(successMapSelectors.selectSelectedSeason);

  showLegendTooltip(targetElId: string, triggerType: TooltipTriggerType, event: any) {
    const targetEl = document.getElementById(targetElId)
    const tooltip = new Tooltip(targetEl, event.target as HTMLElement, { triggerType });
    tooltip.show();
  }
}
