import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ScrapedHunt, Wma } from "@model";
import { NgIcon } from "@ng-icons/core";
import { Store } from "@ngrx/store";
import { SHARED_MODULES } from "@shared-imports";
import { AppStateInterface } from "@store-model";
import { map, take, tap } from "rxjs";
import * as adminActions from "store/admin/admin.actions";
import * as adminSelectors from "store/admin/admin.selectors";

@Component({
  selector: "add-hunts",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_MODULES, ReactiveFormsModule, NgIcon],
  template: `
    <div class="add-hunts ">

      <button class="btn btn-default m-2"
        (click)="loadScrapedHunts()">Load Scraped Hunts</button>

      @if (wmas$ | async; as wmas) {
        <div class="p-4 rounded-lg bg-gray-800 text-sm text-gray-200 pb-48">
          <form [formGroup]="huntsForm">
            <table class="w-full" formArrayName="hunts">
              <thead>
                <tr>
                  <th class="w-[600px]">WMA | Details</th>
                  <th class="w-[150px]">Start, End Date</th>
                  <th class="w-[250px] text-center">Hunters | Bucks | Does | Quota</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                @for (ctrl of huntsForm.controls.hunts.controls; track $index) {
                  @if (scrapedHunts()) {
                    <tr>
                      <td colspan="3" class="bg-gray-300 text-gray-800 border-b border-gray-400 p-2 mb-0">
                        <span class="font-bold">{{ scrapedHunts()[$index].wmaName }}</span> | {{ scrapedHunts()[$index].details }} |
                        <span class="font-bold">{{ scrapedHunts()[$index].weapon | titlecase }}</span> |
                        {{ scrapedHunts()[$index].startdate | date: 'MM/dd/yyyy' }} - {{ scrapedHunts()[$index].enddate | date: 'MM/dd/yyyy' }} |
                        Hunters: {{ scrapedHunts()[$index].hunterCount }} | Bucks: {{ scrapedHunts()[$index].bucks }} |
                        Does: {{ scrapedHunts()[$index].does }}
                      </td>
                      <td class="mb-0">&nbsp;</td>
                    </tr>
                  }
                  <tr [formGroupName]="$index">
                    <td class="py-2 border-l border-gray-400" [ngStyle]="{ 'background-color': ctrl.get('disabled')?.value ? '#f8f8f8' : '' }">
                      <div class="block">
                        <select formControlName="wma" class="bg-gray-900 rounded-md w-[100%]">
                          <option value="">Select WMA</option>
                          @for (wma of wmas; track wma.id) {
                            <option [value]="wma.id">{{ wma.name }}</option>
                          }
                        </select>
                        <input formControlName="details" type="text" class="w-[100%]">
                      </div>
                    </td>
                    <td class="py-2" [ngStyle]="{ 'background-color': ctrl.get('disabled')?.value ? '#f8f8f8' : '' }">
                      <div class="block">
                        <input formControlName="start" type="date" class="w-[145px]">
                        <input formControlName="end" type="date" class="w-[145px]">
                      </div>
                    </td>
                    <td class="py-2" [ngStyle]="{ 'background-color': ctrl.get('disabled')?.value ? '#f8f8f8' : '' }">
                      <div class="block">
                        <div class="flex">
                          <input formControlName="hunters" type="number" class="">
                          <input formControlName="bucks" type="number" class="">
                          <input formControlName="does" type="number" class="">
                          <input formControlName="quota" type="number" class="">
                        </div>
                        <div class="flex">
                          <div class="flex items-center ps-3">
                            <input formControlName="bonus" id="bonus{{ $index }}" type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500">
                            <label for="bonus{{ $index }}" class="w-full py-3 ms-2 text-sm font-medium text-gray-300">Bonus/Quota</label>
                          </div>
                          <div class="flex items-center ps-3">
                            <input formControlName="buckonly" id="buckonly{{ $index }}" type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500">
                            <label for="buckonly{{ $index }}" class="w-full py-3 ms-2 text-sm font-medium text-gray-300">Buck Only</label>
                          </div>
                          <div class="flex items-center ps-3">
                            <input formControlName="qualitybuck" id="qualitybuck{{ $index }}" type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500">
                            <label for="qualitybuck{{ $index }}" class="w-full py-3 ms-2 text-sm font-medium text-gray-300">Quality Buck</label>
                          </div>
                          <div class="flex items-center ps-3">
                            <input formControlName="eithersex" id="eithersex{{ $index }}" type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500">
                            <label for="eithersex{{ $index }}" class="w-full py-3 ms-2 text-sm font-medium text-gray-300">Either Sex</label>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="align-text-bottom">
                      <!-- @if (!$last) { -->
                        <a class="ml-1 text-2xl" type="button" (click)="remove($index)" href="javascript:;">
                          <ng-icon name="heroTrash" class="me-2"></ng-icon>
                        </a>
                      <!-- } -->
                      @if ($last) {
                        <a class="ml-1 text-2xl" type="button" (click)="add()" href="javascript:;">
                          <ng-icon name="heroPlusCircle" class="me-2"></ng-icon>
                        </a>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </form>
          <!-- <pre>{{ scrapedHunts$ | async | json }}</pre> -->
          <div>
            @if (huntsForm.controls.hunts.controls.length > 0) {
              <button class="btn btn-primary m-2">Save</button>
            }
          </div>
          <pre>{{ huntsForm.value | json }}</pre>
        </div>
      }
    </div>
  `,
})
export class AddHuntsComponent implements OnInit {

  private _formBuilder = inject(FormBuilder);
  private _store = inject(Store<AppStateInterface>);
  private _cdr = inject(ChangeDetectorRef);

  scrapedHunts = signal<ScrapedHunt[]>([]);
  wmas = signal<Wma[]>([]);

  wmas$ = this._store.select(adminSelectors.selectWmas)
    .pipe(
      map((wmas) => wmas as Wma[]),
      tap((wmas) => this.wmas.set(wmas))
    );

  scrapedHunts$ = this._store.select(adminSelectors.selectScrapedHunts);

  huntsForm = this._formBuilder.group({
    hunts: this._formBuilder.array([])
  });

  ngOnInit(): void {
    this._store.dispatch(adminActions.enterAddHuntsPage());
    this._store.dispatch(adminActions.loadScrapedHunts());
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
        does: [''],
        quota: [''],
        bonus: [false],
        buckonly: [false],
        qualitybuck: [false],
        eithersex: [false],
      })
    );
  }

  loadScrapedHunts() {
    this.scrapedHunts$
      .pipe(
        take(1),
        map((scrapedHunts) => scrapedHunts as ScrapedHunt[]),
        tap((scrapedHunts) => this.scrapedHunts.set(scrapedHunts)),
        tap(() => this.setScrapedHuntsCtrls())
      ).subscribe(() => {
        this._cdr.detectChanges();
      });
  }

  setScrapedHuntsCtrls() {
    if (this.scrapedHunts()) {
      const huntsFormArray = this.huntsForm.controls.hunts as FormArray;
      this.scrapedHunts().forEach((scrapedHunt) => {
        huntsFormArray.push(
          this._formBuilder.group({
            _uniq: [Math.round(Math.random() * 100000000)],
            wma: [this._findWma(scrapedHunt.wmaName)],
            details: [scrapedHunt.details],
            start: [scrapedHunt.startdate],
            end: [scrapedHunt.enddate],
            hunters: [scrapedHunt.hunterCount],
            bucks: [scrapedHunt.bucks],
            does: [scrapedHunt.does],
            quota: [''],
            bonus: [scrapedHunt.isBonus],
            buckonly: [scrapedHunt.isBuckOnly],
            qualitybuck: [scrapedHunt.isQualityBuck],
            eithersex: [scrapedHunt.isEitherSex],
            disabled: [false]
          })
        );
      });
    }
  }

  remove(index: number) {
    const huntsFormArray = this.huntsForm.get("hunts") as FormArray;
    // huntsFormArray.removeAt(index);
    huntsFormArray.controls[index].get("disabled")?.setValue(true);
    this._cdr.detectChanges();
  }

  trackByFn(item: AbstractControl): number {
    const control = item as FormGroup;
    console.log(control.get("_uniq")?.value);
    return control.get("_uniq")?.value;
  }

  private _findWma(wmaName: string): number | undefined {
    const flattenWmaName = (name: string) => {
      const flattedName = name.toLowerCase()
        .replace(/ /g, '')
        .replace(/-/g, '')
        .replace(/'/g, '')
        .replace(/,/g, '')
        .replace(/\./g, '')
        .replace(/wma/g, '')
        .replace(/&/g, '');
      return flattedName;
    };
    const found = this.wmas().find((wma) => flattenWmaName(wma.name) === flattenWmaName(wmaName));
    if (found) {
      return found.id;
    }
    return undefined;
  }

}
