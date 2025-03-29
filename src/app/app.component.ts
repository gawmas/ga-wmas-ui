import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { HeaderComponent } from 'layout/header.component';
import { initFlowbite } from 'flowbite';
import { FooterComponent } from 'layout/footer.component';
import { SplashComponent } from 'components/splash.component';

@Component({
    selector: 'gawmas-root',
    imports: [HeaderComponent, RouterOutlet, FooterComponent, SplashComponent],
    template: `
    <div class="flex flex-col min-h-screen max-w-[1400px] bg-gradient-to-r from-gawmas-green to-gray-900 from-20% to-80%">
      <header class="sticky fixed z-50 top-0 left-0 w-[100%] bg-gray-900 p-0">
        <gawmas-header></gawmas-header>
      </header>
      <!-- <gawmas-splash #splashModal></gawmas-splash> -->
      <div class="flex-grow top-60 left-0">
        <main>
          <router-outlet></router-outlet>
        </main>
      </div>
      <gawmas-footer></gawmas-footer>
    </div>
  `
})
export class AppComponent implements OnInit, AfterViewChecked {

  @ViewChild('splashModal') splashModal!: SplashComponent;

  ngAfterViewChecked(): void {
    // this.splashModal.openSplash();
  }

  ngOnInit(): void {
    initFlowbite();
  }

}
