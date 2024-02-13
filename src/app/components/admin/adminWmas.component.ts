import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgIconComponent } from "@ng-icons/core";
import { Store, select } from "@ngrx/store";
import { SHARED_MODULES } from "@shared-imports";
import { AppStateInterface } from "@store-model";
import { selectFiltersAuxData } from 'store/filters/filters.selectors';

@Component({
  selector: 'gawmas-admin-wmas',
  standalone: true,
  imports: [SHARED_MODULES, NgIconComponent, FormsModule],
  template: `
    <div class="m-3 bg-gray-800">
      <div class="mb-6 mx-6">
        <label for="default-input" class="block mb-2 text-sm font-medium text-white">Filter</label>
        <input type="text" id="default-input" placeholder="Search for a WMA ..." [(ngModel)]="filterText" (keypress)="filterWmas($event)"
          class="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
      </div>
      <table class="w-[95%] text-sm text-left text-gray-300 -pt-2">
        <thead class="text-xs text-gray-400 uppercase bg-gray-800 border-gray-400 border-b-2 border-t-1">
          <tr>
            <th scope="col" class="px-6 py-3">WMA</th>
            <th scope="col" class="px-6 py-3 w-[200px]">Hist Climate Town</th>
            <th scope="col" class="px-6 py-3 w-[150px] text-center">State Park</th>
            <th scope="col" class="px-6 py-3 w-[300px] text-center">VPA</th>
          </tr>
        </thead>
        <tbody>
          @if (auxData$ | async; as auxData) {
            @for (wma of auxData.wmas; track wma.id) {
              <tr class="border-gray-400 border-b-2">
                <td class="px-6 py-4">
                  <a href="#" class="font-semibold hover:underline">{{ wma.name }}</a> ({{ wma.id }})
                </td>
                <td class="px-6 py-4">shitlick</td>
                <td class="px-6 py-4 text-center text-xl font-bold">
                  @if (wma.isSP) {
                    <ng-icon name="heroCheckCircleSolid" class="text-green-500" />
                  }
                </td>
                <td class="px-6 py-4 text-center text-xl font-bold">
                  @if (wma.isVPA) {
                    <ng-icon name="heroCheckCircleSolid" class="text-green-500" />
                  }
                </td>
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
  `
})
export class AdminWmasComponent {

  private _store = inject(Store<AppStateInterface>);

  auxData$ = this._store.select(selectFiltersAuxData);

  filterText = '';

  filterWmas(event: any) {
    console.log(this.filterText, event);
  }

}
