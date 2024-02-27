import { Component } from "@angular/core";

@Component({
  selector: 'gawmas-about',
  standalone: true,
  template: `
    <div class="bg-gray-900 mx-1 my-1 p-4 text-gray-300">
      <h3 class="text-xl font-semibold text-white lg:text-2xl mt-4 ml-4">
        About this Project
      </h3>
      <div class="p-6">
        <p class="p-1">
          This product emerged from the fundamental question: <span class="italic">
            "Do weather and lunar phase play a role
            in determining the success of deer hunting?"
          </span>
        </p>
        <p class="p-1">
          Rather than offering a conclusive answer, the goal is to furnish hunters with
          empirical data and analytical tools, empowering them to draw their own informed conclusions.
        </p>
        <p class="p-1">
          Regardless of whether the data directly addresses the initial question, the hope
          is that the tools presented here prove useful in helping you pinpoint the most
          productive WMAs to invest your time this fall.
        </p>
      </div>
    </div>
  `,
})
export class AboutComponent {}
