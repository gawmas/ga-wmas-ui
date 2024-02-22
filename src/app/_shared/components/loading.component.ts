import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'gawmas-loading',
  standalone: true,
  template: `
    <div class="fixed inset-0 z-40 bg-gray-800 bg-opacity-25 backdrop-blur-sm"></div>
    <div [class.opacity-0]="fadeOut" class="fixed top-1/4 inset-x-0 flex items-center justify-center z-50 opacity-100 transition-opacity duration-2000">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100" height="100">
      <circle fill="#F9BF4B" stroke="#F9BF4B" stroke-width="15" r="15" cx="35" cy="100">
          <animate attributeName="cx" calcMode="spline" dur="2" values="35;165;165;35;35" keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1" repeatCount="indefinite" begin="0"></animate>
        </circle>
        <circle fill="#F9BF4B" stroke="#F9BF4B" stroke-width="15" opacity=".8" r="15" cx="35" cy="100">
          <animate attributeName="cx" calcMode="spline" dur="2" values="35;165;165;35;35" keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1" repeatCount="indefinite" begin="0.05"></animate>
        </circle>
        <circle fill="#F9BF4B" stroke="#F9BF4B" stroke-width="15" opacity=".6" r="15" cx="35" cy="100">
          <animate attributeName="cx" calcMode="spline" dur="2" values="35;165;165;35;35" keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1" repeatCount="indefinite" begin=".1"></animate>
        </circle>
        <circle fill="#F9BF4B" stroke="#F9BF4B" stroke-width="15" opacity=".4" r="15" cx="35" cy="100">
          <animate attributeName="cx" calcMode="spline" dur="2" values="35;165;165;35;35" keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1" repeatCount="indefinite" begin=".15"></animate>
        </circle>
        <circle fill="#F9BF4B" stroke="#F9BF4B" stroke-width="15" opacity=".2" r="15" cx="35" cy="100">
          <animate attributeName="cx" calcMode="spline" dur="2" values="35;165;165;35;35" keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1" repeatCount="indefinite" begin=".2"></animate>
        </circle>
      </svg>
    </div>
  `,
  styles: [`
    .opacity-0 {
      opacity: 0;
    }
  `]
})
export class LoadingComponent implements OnInit {
  fadeOut: boolean = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.fadeOut = true;
    }, 2000);
  }
}


