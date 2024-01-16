import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { HeaderComponent } from 'layout/header.component';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'gawmas-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, NgIconComponent],
  template: `
    <gawmas-header></gawmas-header>
    <div class="container m-0 p-0 w-screen bg-gray-900">
      <main class="p-2 bg-gray-900">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    initFlowbite();
  }

}
