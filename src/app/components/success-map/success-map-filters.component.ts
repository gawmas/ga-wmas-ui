import { Component, OnInit } from "@angular/core";
import { NgIcon } from "@ng-icons/core";
import { SHARED_MODULES } from "@shared-imports";
import { Popover, PopoverInterface } from "flowbite";

@Component({
  selector: "gawmas-success-map-filters",
  standalone: true,
  imports: [SHARED_MODULES, NgIcon],
  styles: [`
    .filter-box {
      position: absolute;
      z-index: 9999;
      left: 25;
    }
  `],
  template: `
    <div class="ml-2 z-9999 text-gray-200 text-xs border-r border-b border-gray-600 rounded-br-2xl bg-gray-900 filter-box p-2 animate-jump-in animate-delay-100 animate-once">
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
              class="rounded-l-full px-3 py-2 inline-flex items-center justify-between bg-gray-700 cursor-pointer peer-checked:bg-blue-600 peer-checked:underline peer-checked:font-bold hover:bg-gray-800">
                Archery
            </label>
          </li>
          <li>
            <input type="radio" id="primitive" name="weapon" value="hosting-small" class="hidden peer">
            <label for="primitive"
              class="inline-flex items-center justify-between px-3 py-2 bg-gray-700 cursor-pointer peer-checked:bg-blue-600 peer-checked:underline peer-checked:font-bold hover:bg-gray-800">
              Primitive
            </label>
          </li>
          <li>
            <input type="radio" id="firearms" name="weapon" value="hosting-small" class="hidden peer">
            <label for="firearms"
              class="inline-flex items-center justify-between px-3 py-2 bg-gray-700 cursor-pointer peer-checked:bg-blue-600 peer-checked:underline peer-checked:font-bold hover:bg-gray-800">
              Firearms
            </label>
          </li>
          <li>
            <input type="radio" id="any" name="weapon" value="hosting-small" class="hidden peer" checked>
            <label for="any"
              class="rounded-r-full inline-flex items-center justify-between px-3 py-2 bg-gray-700 cursor-pointer peer-checked:bg-blue-600 peer-checked:underline peer-checked:font-bold hover:bg-gray-800">
              Any
            </label>
          </li>
        </ul>

        <ul class="invisible md:visible w-full gap-0 inline-flex ml-2">
          <li>
            <input type="radio" id="success" name="statType" value="hosting-small" class="hidden peer" checked>
            <label for="success"
              class="rounded-l-full px-3 py-2 inline-flex items-center justify-between bg-gray-700 cursor-pointer peer-checked:bg-blue-600 peer-checked:underline peer-checked:font-bold hover:bg-gray-800">
                Success Rate
            </label>
          </li>
          <li>
            <input type="radio" id="total" name="statType" value="hosting-small" class="hidden peer">
            <label for="total"
              class="rounded-r-full inline-flex items-center justify-between px-3 py-2 bg-gray-700 cursor-pointer peer-checked:bg-blue-600 peer-checked:underline peer-checked:font-bold hover:bg-gray-800">
              Total Harvest
            </label>
          </li>
        </ul>

        <div class="ml-2">
          <button data-tooltip-target="extenttip">
            <ng-icon name="heroGlobeAlt" class="text-2xl text-gray-200"></ng-icon>
          </button>
          <div id="extenttip" role="tooltip"
            class="absolute z-10 invisible inline-block px-3 py-2 text-xs font-medium text-gray-800 transition-opacity duration-300 bg-gray-300 rounded-full shadow-sm opacity-0 tooltip">
              Zoom to full extent
            <div class="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>

        <div class="ml-2">
          <button data-popover-target="mappop" data-popover-placement="right">
            <ng-icon name="heroInformationCircle" class="text-2xl text-gray-200"></ng-icon>
          </button>
        </div>
        <div data-popover id="mappop" role="tooltip" class="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0">
          <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
            <h3 class="font-semibold text-gray-900">About this Map</h3>
          </div>
          <div class="px-3 py-2">
            <p>Map visualization of total deer harvest or success rates based on WMA location. Use the toggles to explore. The larger the dot, the larger the value.</p>
          </div>
          <div data-popper-arrow></div>
        </div>

      </div>

    </div>
  `,
})
export class SuccessMapFiltersComponent {}
