import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { HeaderComponent } from 'layout/header/header.component';
import { initFlowbite } from 'flowbite';
import { FooterComponent } from 'layout/footer/footer.component';

@Component({
  selector: 'gawmas-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, NgIconComponent, FooterComponent],
  template: `
    <gawmas-header></gawmas-header>
    <div class="m-0 p-0 w-screen">
      <main class="px-2">
        <router-outlet></router-outlet>
        <gawmas-footer></gawmas-footer>
      </main>
    </div>
  `
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    initFlowbite();
  }

}
