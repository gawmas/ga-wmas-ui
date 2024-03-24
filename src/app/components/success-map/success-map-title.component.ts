import { Component, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { SeasonTextPipe } from "@pipes";
import { SHARED_MODULES } from "@shared-imports";
import { AppStateInterface } from "@store-model";
import * as successMapSelectors from 'store/successMap/successMap.selectors';

@Component({
  selector: 'gawmas-success-map-title',
  standalone: true,
  imports: [SHARED_MODULES, SeasonTextPipe],
  template: `
    <div class="mb-1 mt-0 py-1 flex items-center justify-center text-xs md:text-base">
      <span class="border-r border-gray-600 px-2 font-semibold text-gray-300">
        {{ (seasons$ | async)! | seasonText:(selectedSeasons | async)?.toString() ?? '' }}
      </span>
      <span class="italic ml-2 tracking-widest"> {{ mapTitle$ | async }}</span>
    </div>
  `
})
export class SuccessMapTitleComponent {
  private _store = inject(Store<AppStateInterface>);
  mapTitle$ = this._store.select(successMapSelectors.selectMapTitle);
  seasons$ = this._store.select(successMapSelectors.selectSeasons);
  selectedSeasons = this._store.select(successMapSelectors.selectSelectedSeason);
}