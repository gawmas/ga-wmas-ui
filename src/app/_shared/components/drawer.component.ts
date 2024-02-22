import { Component, Input, Output } from "@angular/core";
import { DrawerCloseEvent } from "@model";
import { Drawer, DrawerInterface, DrawerOptions, InstanceOptions } from "flowbite";
import { Subject } from "rxjs";

@Component({
  selector: 'gawmas-drawer',
  standalone: true,
  template: `
    <div [id]="targetElement"
      class="fixed w-[100%] lg:w-10/12 top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-gray-800"
      tabindex="-1">
      <ng-content></ng-content>
    </div>
  `
})
export class DrawerComponent {

  @Input() targetElement = '';

  private closeEventSubject = new Subject<DrawerCloseEvent>();
  @Output() closeEvent: Subject<DrawerCloseEvent> = this.closeEventSubject;

  options: DrawerOptions = {
    placement: 'left',
    backdrop: true,
    bodyScrolling: false,
    edge: false,
    edgeOffset: '',
    backdropClasses: 'bg-gray-900/80 backdrop-blur-sm fixed inset-0 z-30',
  };

  instanceOptions: InstanceOptions = {
    id: `${this.targetElement}`,
    override: true
  };

  drawer: DrawerInterface = {} as DrawerInterface;

  closeAction: DrawerCloseEvent = { closed: false };

  public open(): void {
    let element = document.getElementById(this.targetElement) as HTMLElement;
    this.drawer = new Drawer(element, this.options, this.instanceOptions);
    this.drawer.show();
  }

  public save(data?: any): void {
    this.drawer.hide();
    this.closeAction.saved = true;
    this.closeAction.closed = true;
    this.closeAction.data = data ? data : undefined;
    this.closeEventSubject?.next(this.closeAction);
  }

  public close(): void {
    this.drawer.hide();
    this.closeAction.closed = true;
    this.closeAction.saved = false;
    this.closeEventSubject?.next(this.closeAction);
  }

}
