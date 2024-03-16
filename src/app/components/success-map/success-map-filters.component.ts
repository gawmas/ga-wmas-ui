import { Component } from "@angular/core";
import { SHARED_MODULES } from "@shared-imports";

@Component({
  selector: "gawmas-success-map-filters",
  standalone: true,
  imports: [SHARED_MODULES],
  styles: [`
    .filter-box {
      position: absolute;
      z-index: 9999;
      left: 25;
    }
  `],
  template: `
    <div class="ml-2 text-gray-200 text-xs border-r border-b border-gray-600 rounded-br-md bg-gray-900 filter-box p-2">
      <div class="flex items-center">
        <select class="select py-2 px-3">
          <option value="">2023 &ndash; 2024 (Latest)</option>
          <option value="">2022 &ndash; 2023</option>
          <option value="">2021 &ndash; 2022</option>
        </select>
        <ul class="invisible md:visible w-full gap-0 inline-flex ml-2">
          <li>
            <input type="radio" id="archery" name="weapon" value="hosting-small" class="hidden peer">
            <label for="archery"
              class="rounded-l-full px-3 py-2 inline-flex items-center justify-between bg-gray-700 cursor-pointer peer-checked:bg-blue-600 hover:bg-gray-800">
                Archery
            </label>
          </li>
          <li>
            <input type="radio" id="primitive" name="weapon" value="hosting-small" class="hidden peer">
            <label for="primitive"
              class="inline-flex items-center justify-between px-3 py-2 bg-gray-700 cursor-pointer peer-checked:bg-blue-600 hover:bg-gray-800">
              Primitive
            </label>
          </li>
          <li>
            <input type="radio" id="firearms" name="weapon" value="hosting-small" class="hidden peer">
            <label for="firearms"
              class="inline-flex items-center justify-between px-3 py-2 bg-gray-700 cursor-pointer peer-checked:bg-blue-600 hover:bg-gray-800">
              Firearms
            </label>
          </li>
          <li>
            <input type="radio" id="any" name="weapon" value="hosting-small" class="hidden peer" checked>
            <label for="any"
              class="rounded-r-full inline-flex items-center justify-between px-3 py-2 bg-gray-700 cursor-pointer peer-checked:bg-blue-600 hover:bg-gray-800">
              Any
            </label>
          </li>
        </ul>
        <ul class="invisible md:visible w-full gap-0 inline-flex ml-2">
          <li>
            <input type="radio" id="success" name="statType" value="hosting-small" class="hidden peer" checked>
            <label for="success"
              class="rounded-l-full px-3 py-2 inline-flex items-center justify-between bg-gray-700 cursor-pointer peer-checked:bg-blue-600 hover:bg-gray-800">
                Success Rate
            </label>
          </li>
          <li>
            <input type="radio" id="total" name="statType" value="hosting-small" class="hidden peer">
            <label for="total"
              class="rounded-r-full inline-flex items-center justify-between px-3 py-2 bg-gray-700 cursor-pointer peer-checked:bg-blue-600 hover:bg-gray-800">
              Total Harvest
            </label>
          </li>
        </ul>
      </div>
    </div>
  `,
})
export class SuccessMapFiltersComponent {}
