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
    <div class="max-w-[1400px] mx-auto bg-gradient-to-r from-gawmas-green to-transparent from-20% to-80%">
      <gawmas-header></gawmas-header>
      <gawmas-splash #splashModal></gawmas-splash>
        <main>
          <router-outlet></router-outlet>
        </main>
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
