import { NgFor } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: 'gawmas-wx-details-skeleton',
  standalone: true,
  imports: [NgFor],
  template: `
    <div role="status" class="w-full animate-pulse">
      <span class="sr-only">Loading...</span>

        <div class="ml-3 mr-4 mt-3">
          <div class="ml-2 h-4 rounded-full bg-gray-500 w-60 mb-4"></div>
          <div class="flex items-center">
            <div *ngFor="let i of [].constructor(duration || 3)" class="w-{{ duration === 4 ? '1/4' : duration === 3 ? '1/3' : duration === 2 ? '1/2' : '' }}">
              <div class="h-3 rounded-full bg-gray-500 mb-2.5 ml-2.5"></div>
              <div class="h-3 rounded-full bg-gray-500 mb-2.5 ml-2.5"></div>
              <div class="h-3 rounded-full bg-gray-500 mb-8 ml-2.5"></div>
            </div>
          </div>
        </div>

        <div class="ml-4 mr-4">
          <div class="h-4 rounded-full bg-gray-500 w-64 mb-4"></div>
          <div class="flex items-center">
            <div *ngFor="let i of [].constructor(duration || 3)" class="w-{{ duration === 4 ? '1/4' : duration === 3 ? '1/3' : duration === 2 ? '1/2' : '' }}">
              <div class="flex items-center">
                <div class="w-1/2">
                  <div class="h-3 w-full mr-2 rounded-full bg-gray-500 mb-4"></div>
                  <div class="flex items-center justify-center w-20 h-20 mb-3  rounded bg-gray-500">
                    <svg class="w-10 h-10 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                      <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                    </svg>
                  </div>
                  <div class="h-2 w-full mr-2 rounded-md bg-gray-500 mb-4"></div>
                  <div class="h-2 w-full mr-2 rounded-md bg-gray-500 mb-4"></div>
                  <div class="h-2 w-full mr-2 rounded-md bg-gray-500 mb-4"></div>
                  <div class="h-2 w-full mr-2 rounded-md bg-gray-500 mb-4"></div>
                  <div class="h-2 w-full mr-2 rounded-md bg-gray-500 mb-4"></div>
                </div>
                <div class="w-1/2">
                  <div class="h-3 w-full mr-2 rounded-full bg-gray-500 mb-4"></div>
                  <div class="flex items-center justify-center w-20 h-20 mb-3 rounded bg-gray-500">
                    <svg class="w-10 h-10 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                      <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                    </svg>
                  </div>
                  <div class="h-2 w-full mr-2 rounded-md bg-gray-500 mb-4"></div>
                  <div class="h-2 w-full mr-2 rounded-md bg-gray-500 mb-4"></div>
                  <div class="h-2 w-full mr-2 rounded-md bg-gray-500 mb-4"></div>
                  <div class="h-2 w-full mr-2 rounded-md bg-gray-500 mb-4"></div>
                  <div class="h-2 w-full mr-2 rounded-md bg-gray-500 mb-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="ml-3 mr-4">
          <div class="h-4 rounded-full bg-gray-500 w-48 mb-4"></div>
          <div class="flex items-center">
            <div *ngFor="let i of [].constructor(duration || 3)" class="w-{{ duration === 4 ? '1/4' : duration === 3 ? '1/3' : duration === 2 ? '1/2' : '' }}">
              <div class="h-3 rounded-full bg-gray-500 mb-2.5 ml-2.5"></div>
              <div class="h-3 rounded-full bg-gray-500 mb-2.5 ml-2.5"></div>
              <div class="h-3 rounded-full bg-gray-500 mb-8 ml-2.5"></div>
            </div>
          </div>
        </div>

        <div class="ml-3 mr-4">
          <div class="h-4 rounded-full bg-gray-500 w-48 mb-4"></div>
          <div class="flex items-center">
            <div *ngFor="let i of [].constructor(duration || 3)" class="w-{{ duration === 4 ? '1/4' : duration === 3 ? '1/3' : duration === 2 ? '1/2' : '' }}">
              <div class="h-3 rounded-full bg-gray-500 mb-2.5 ml-2.5"></div>
              <div class="h-3 rounded-full bg-gray-500 mb-2.5 ml-2.5"></div>
              <div class="h-3 rounded-full bg-gray-500 mb-8 ml-2.5"></div>
            </div>
          </div>
        </div>

    </div>
  `
})
export class WxDetailsSkeletonComponent {
  @Input() duration: number | undefined;
}
