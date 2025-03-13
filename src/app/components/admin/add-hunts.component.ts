import { Component, inject, OnInit, signal } from "@angular/core";
import { FormArray, FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { NgIcon } from "@ng-icons/core";
import { Store } from "@ngrx/store";
import { SHARED_MODULES } from "@shared-imports";
import { AppStateInterface } from "@store-model";
import * as adminActions from "store/admin/admin.actions";
import * as adminSelectors from "store/admin/admin.selectors";

@Component({
  selector: "add-hunts",
  standalone: true,
  imports: [SHARED_MODULES, ReactiveFormsModule, NgIcon],
  template: `

    <div class="w-[100%] h-screen bg-gray-800 text-white p-[20px]">
      <div class="mb-4 border-b border-gray-700">
        <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
          <li class="me-2">
            <button class="inline-block p-4 rounded-t-lg {{ selectedTab() === 'add' ? 'border-b-2 border-blue-500' : '' }}" type="button" role="tab" (click)="changeTab('add')">Add Hunts</button>
          </li>
          <li class="me-2">
            <button class="inline-block p-4 rounded-t-lg hover:text-gray-300 {{ selectedTab() === 'scraped' ? 'border-b-2 border-blue-500' : '' }}" type="button" role="tab" (click)="changeTab('scraped')">Add Scraped Hunts</button>
          </li>
        </ul>
      </div>
      <div>
        @if (selectedTab() === 'add') {
          @if (wmas$ | async; as wmas) {
            <div class="p-4 rounded-lg bg-gray-800 text-sm text-gray-200">
              <form [formGroup]="huntsForm">
                <table class="w-full">
                  <thead>
                    <tr>
                      <th class="text-left w-[350px]">WMA</th>
                      <th class="text-left w-[450px]">Details</th>
                      <th class="text-left w-[145px]">Start Date</th>
                      <th class="text-left w-[145px]">End Date</th>
                      <th class="text-left w-[75px]">Hunters</th>
                      <th class="text-left w-[75px]">Bucks</th>
                      <th class="text-left w-[75px]">Does</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (ctrl of huntsForm.controls.hunts.controls; track $index) {
                      <ng-container formArrayName="hunts">
                        <tr [formGroupName]="$index">
                          <td>
                            <select formControlName="wma" class="bg-gray-900 rounded-md max-w-[350px]">
                              <option value="">Select WMA</option>
                              @for (wma of wmas; track wma.id) {
                                <option [value]="wma.id">{{ wma.name }}</option>
                              }
                            </select>
                          </td>
                          <td>
                            <input formControlName="details" type="text" class="w-[100%] bg-gray-900 rounded-md">
                          </td>
                          <td>
                            <input formControlName="start" type="date" class="w-[145px] bg-gray-900 rounded-md">
                          </td>
                          <td>
                            <input formControlName="end" type="date" class="w-[145px] bg-gray-900 rounded-md">
                          </td>
                          <td>
                            <input formControlName="hunters" type="number" class="w-[100%] bg-gray-900 rounded-md">
                          </td>
                          <td>
                            <input formControlName="bucks" type="number" class="w-[100%] bg-gray-900 rounded-md">
                          </td>
                          <td>
                            <input formControlName="does" type="number" class="w-[100%] bg-gray-900 rounded-md">
                          </td>
                          <td>
                            @if (!$last) {
                              <a class="ml-1 text-2xl" type="button" (click)="remove($index)" href="javascript:;">
                                <ng-icon name="heroTrash" class="me-2"></ng-icon>
                              </a>
                            }
                            @if ($last) {
                              <a class="ml-1 text-2xl" type="button" (click)="add()" href="javascript:;">
                                <ng-icon name="heroPlusCircle" class="me-2"></ng-icon>
                              </a>
                            }
                          </td>
                        </tr>
                      </ng-container>
                    }
                  </tbody>
                </table>
              </form>
              <pre>{{ huntsForm.value | json }}</pre>
            </div>
          }
        }
        @if (selectedTab() === 'scraped') {
          <div class="p-4 rounded-lg bg-gray-800">
            <p class="text-sm text-gray-200">Scraped</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
  td input, td select {
    font-size: 13px;
  }
  `]
})
export class AddHuntsComponent implements OnInit {

  private _formBuilder = inject(FormBuilder);
  private _store = inject(Store<AppStateInterface>);

  selectedTab = signal("add");

  wmas$ = this._store.select(adminSelectors.selectWmas);

  huntsForm = this._formBuilder.group({
    hunts: this._formBuilder.array([])
  });

  ngOnInit(): void {

    this._store.dispatch(adminActions.enterAddHuntsPage());

    const huntsFormArray = this.huntsForm.get("hunts") as FormArray;
    huntsFormArray.push(
      this._formBuilder.group({
        wma: [''],
        details: [''],
        start: [''],
        end: [''],
        hunters: [''],
        bucks: [''],
        does: ['']
      })
    );
  }

  changeTab(tab: string) {
    this.selectedTab.set(tab);
  }

  add() {
    const huntsFormArray = this.huntsForm.get("hunts") as FormArray;
    const wma = huntsFormArray.at(huntsFormArray.length - 1).get("wma")?.value;
    huntsFormArray.push(
      this._formBuilder.group({
        wma: [wma],
        details: [''],
        start: [''],
        end: [''],
        hunters: [''],
        bucks: [''],
        does: ['']
      })
    );
  }

  remove(index: number) {
    const huntsFormArray = this.huntsForm.get("hunts") as FormArray;
    console.log(huntsFormArray.at(index).value);
    huntsFormArray.removeAt(index);
  }

}
