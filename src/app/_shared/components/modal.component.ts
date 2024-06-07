import { Component, Input, Output } from "@angular/core";
import { DrawerCloseEvent, ModalCloseEvent } from "@model";
import { Modal } from 'flowbite';
import type { ModalOptions, ModalInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';
import { Subject } from "rxjs";

@Component({
  selector: 'gawmas-modal',
  standalone: true,
  template: `
    <div [id]="targetElement"
      class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center inset-2 h-modal md:h-full"
      tabindex="-1">
      <div class="relative max-h-full lg:max-w-[1024px] w-[90%]">
        <div class="relative rounded-2xl shadow bg-gray-700 text-gray-200">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
})
export class ModalComponent {

  @Input() targetElement = '';

  private closeEventSubject = new Subject<ModalCloseEvent>();
  @Output() closeEvent: Subject<DrawerCloseEvent> = this.closeEventSubject;

  modalOptions: ModalOptions = {
    placement: 'bottom-right',
    backdrop: 'dynamic',
    closable: false,
    backdropClasses:
      'bg-gray-900/90 backdrop-blur-sm fixed inset-0 z-30',
  };

  instanceOptions: InstanceOptions = {
    id: `${this.targetElement}`,
    override: true
  };

  modal: ModalInterface = {} as ModalInterface;

  closeAction: ModalCloseEvent = { closed: false };

  public open(): void {
    let element = document.getElementById(this.targetElement) as HTMLElement;
    this.modal = new Modal(element, this.modalOptions, this.instanceOptions);
    this.modal.show();
  }

  public save(data?: any): void {
    this.modal.hide();
    this.closeAction.saved = true;
    this.closeAction.closed = true;
    this.closeAction.data = data ? data : undefined;
    this.closeEventSubject?.next(this.closeAction);
  }

  public close(): void {
    // console.log(this.modal.isVisible())
    this.modal.hide();
    this.closeAction.closed = true;
    this.closeEventSubject?.next(this.closeAction);
  }
}
