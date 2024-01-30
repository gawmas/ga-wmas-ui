import { Component, ViewChild } from "@angular/core";
import { NgIconComponent } from "@ng-icons/core";
import { ModalComponent } from "_shared/components/modal.component";
import { AboutComponent } from "components/about.component";

@Component({
  selector: 'gawmas-header',
  standalone: true,
  imports: [NgIconComponent, ModalComponent, AboutComponent],
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  @ViewChild('aboutModal') aboutModal!: AboutComponent;

  openAbout(): void {
    this.aboutModal?.openAbout();
  }

}
