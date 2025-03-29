import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal, ViewEncapsulation } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ScrapedHunt, Season, Weapon, Wma } from "@model";
import { NgIcon } from "@ng-icons/core";
import { Store } from "@ngrx/store";
import { SHARED_MODULES } from "@shared-imports";
import { AppStateInterface } from "@store-model";
import { LoadingComponent } from "_shared/components/loading.component";
import { map, take, tap } from "rxjs";
import * as adminActions from "store/admin/admin.actions";
import * as adminSelectors from "store/admin/admin.selectors";
import * as filterSelectors from "store/filters/filters.selectors";

@Component({
  selector: "add-hunts",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_MODULES, ReactiveFormsModule, NgIcon, LoadingComponent],
  template: `

    @if (isLoading$ | async) {
      <gawmas-loading />
    }

    <ul class="flex flex-wrap mx-2 mt-2 text-sm font-medium text-center border-b border-gray-700 text-gray-400">
      <li class="me-2">
        <a href="javascript:;" (click)="mode.set('bulk')"
          class="inline-block p-4 rounded-t-lg hover:bg-gray-800 hover:text-gray-300"
          [ngClass]="{ 'active bg-gray-800 text-blue-500': mode() === 'bulk' }">Bulk</a>
      </li>
      <li class="me-2">
        <a href="javascript:;" (click)="switchSingle()"
          class="inline-block p-4 rounded-t-lg hover:bg-gray-800 hover:text-gray-300"
          [ngClass]="{ 'active bg-gray-800 text-blue-500': mode() === 'single' }">Single</a>
      </li>
    </ul>

    @if (mode() === 'bulk') {
      <div class="add-hunts">

        @if (auxData$ | async; as data) {
          <div class="p-4 rounded-lg bg-gray-800 text-sm text-gray-200 pb-48">
            <form [formGroup]="bulkHuntsForm" (submit)="save(true)">
              <div class="flex items-center mb-2">
                <select formControlName="season" class="bg-gray-900 rounded-full"
                    [ngClass]="{'border-red-500': bulkHuntsForm.controls.season.invalid}">
                  <option value="">Select Season</option>
                  @for (s of data.seasons; track s.id) {
                    <option [value]="s.id">{{ s.season }}</option>
                  }
                </select>
                @if (bulkHuntsForm.controls.season.valid) {
                  <button type="button" class="btn btn-default m-2"
                    (click)="loadScrapedHunts()">Load Scraped Hunts</button>
                }
              </div>
              <table class="w-full" formArrayName="hunts">
              @if (bulkHuntsForm.controls.hunts.controls.length > 0) {
                <thead>
                  <tr>
                    <th class="w-[600px]">WMA | Details</th>
                    <th class="w-[150px]">Start, End Date</th>
                    <th class="w-[250px] text-center">Hunters | Bucks | Does | Quota</th>
                    <th></th>
                  </tr>
                </thead>
              }
                <tbody>
                  @for (ctrl of bulkHuntsForm.controls.hunts.controls; track $index) {
                    @if (scrapedHunts()) {
                      <tr>
                        <td colspan="3" class="bg-gray-700 text-gray-300 border-b border-gray-400 p-2 mb-0 rounded-t-lg"
                            [ngClass]="{ 'disabled': ctrl.get('disabled')?.value }">
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
                      <td class="pb-4" [ngClass]="{ 'disabled': ctrl.get('disabled')?.value }">
                        <div class="block">
                          <select formControlName="wma" class="bg-gray-900 w-[100%]"
                              [ngClass]="{'border-red-500': ctrl.get('wma')?.invalid}">
                            <option value="">Select WMA</option>
                            @for (wma of data.wmas; track wma.id) {
                              <option [value]="wma.id">{{ wma.name }}</option>
                            }
                          </select>
                          <input formControlName="details" type="text" class="w-[100%] rounded-bl-lg">
                        </div>
                      </td>
                      <td class="pb-4" [ngClass]="{ 'disabled': ctrl.get('disabled')?.value }">
                        <div class="block">
                          <input formControlName="start" type="date" class="w-[145px]"
                            [ngClass]="{'border-red-500': ctrl.get('start')?.invalid}">
                          <input formControlName="end" type="date" class="w-[145px]"
                            [ngClass]="{'border-red-500': ctrl.get('end')?.invalid}">
                        </div>
                      </td>
                      <td class="pb-4" [ngClass]="{ 'disabled': ctrl.get('disabled')?.value }">
                        <div class="block">
                          <div class="flex">
                            <input formControlName="hunters" type="number"
                              [ngClass]="{'border-red-500': ctrl.get('hunters')?.invalid}">
                            <input formControlName="bucks" type="number"
                              [ngClass]="{'border-red-500': ctrl.get('bucks')?.invalid}">
                            <input formControlName="does" type="number"
                              [ngClass]="{'border-red-500': ctrl.get('does')?.invalid}">
                            <input formControlName="quota" type="number" class="">
                          </div>
                          <div class="flex">
                            <select formControlName="weapon" class="bg-gray-900"
                                [ngClass]="{'border-red-500': ctrl.get('weapon')?.invalid}">
                              @for (w of data.weapons; track w.id) {
                                <option [value]="w.id">{{ w.name }}</option>
                              }
                            </select>
                            <div class="flex items-center ps-3">
                              <input formControlName="bonus" id="bonus{{ $index }}"
                                type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500">
                              <label for="bonus{{ $index }}" class="w-full py-3 ms-2 text-sm font-medium text-gray-300">Bonus/Quota</label>
                            </div>
                            <div class="flex items-center ps-3">
                              <input formControlName="buckonly" id="buckonly{{ $index }}"
                                type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500">
                              <label for="buckonly{{ $index }}" class="w-full py-3 ms-2 text-sm font-medium text-gray-300">Buck Only</label>
                            </div>
                            <div class="flex items-center ps-3">
                              <input formControlName="qualitybuck" id="qualitybuck{{ $index }}"
                                type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500">
                              <label for="qualitybuck{{ $index }}" class="w-full py-3 ms-2 text-sm font-medium text-gray-300">Quality Buck</label>
                            </div>
                            <div class="flex items-center ps-3">
                              <input formControlName="eithersex" id="eithersex{{ $index }}"
                                type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500">
                              <label for="eithersex{{ $index }}" class="w-full py-3 ms-2 text-sm font-medium text-gray-300">Either Sex</label>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="align-text-bottom">
                        @if (!ctrl.get('disabled')?.value) {
                          <a class="ml-1 text-xl" type="button" (click)="remove($index)" href="javascript:;">
                            <ng-icon name="heroTrash" class="me-2"></ng-icon>
                          </a>
                        } @else {
                          <a class="ml-1 text-xl" type="button" href="javascript:;">
                            <ng-icon name="heroArrowUturnDown" (click)="remove($index, true)" class="me-2"></ng-icon>
                          </a>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
              <div>
                @if (bulkHuntsForm.controls.hunts.controls.length > 0) {
                  <button type="submit" class="btn btn-primary m-2" [disabled]="bulkHuntsForm.invalid">
                    Ingest Hunts
                  </button>
                }
              </div>
            </form>
            <!-- <pre>{{ scrapedHunts$ | async | json }}</pre> -->
            <!-- <pre>{{ bulkHuntsForm.value | json }}</pre> -->
          </div>
        }
      </div>
    }

    @if (mode() === 'single') {
      <div class="add-hunts">

        @if (auxData$ | async; as data) {
          <div class="p-4 rounded-lg bg-gray-800 text-sm text-gray-200 pb-48">
            <form [formGroup]="singleHuntsForm" (submit)="save(false)">
              <div class="flex items-center mb-2">
                <select formControlName="season" class="bg-gray-900 rounded-full text-sm"
                    [ngClass]="{'border-red-500': singleHuntsForm.get('season')?.invalid}">
                  <option value="">Season</option>
                  @for (s of data.seasons; track s.id) {
                    <option [value]="s.id">{{ s.season }}</option>
                  }
                </select>
              </div>
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
                  @for (ctrl of singleHuntsForm.controls.hunts.controls; track $index) {
                    <tr [formGroupName]="$index">
                      <td class="pb-4" [ngClass]="{ 'disabled': ctrl.get('disabled')?.value }">
                        <div class="block">
                          <select formControlName="wma" class="bg-gray-900 w-[100%]"
                              [ngClass]="{'border-red-500': ctrl.get('wma')?.invalid}">
                            <option value="">WMA</option>
                            @for (wma of data.wmas; track wma.id) {
                              <option [value]="wma.id">{{ wma.name }}</option>
                            }
                          </select>
                          <input formControlName="details" placeholder="Details" type="text" class="w-[100%] rounded-bl-lg"
                            [ngClass]="{'border-red-500': ctrl.get('details')?.invalid}">
                        </div>
                      </td>
                      <td class="pb-4" [ngClass]="{ 'disabled': ctrl.get('disabled')?.value }">
                        <div class="block">
                          <input formControlName="start" type="date" class="w-[145px]"
                            [ngClass]="{'border-red-500': ctrl.get('start')?.invalid}">
                          <input formControlName="end" type="date" class="w-[145px]"
                            [ngClass]="{'border-red-500': ctrl.get('end')?.invalid}">
                        </div>
                      </td>
                      <td class="pb-4" [ngClass]="{ 'disabled': ctrl.get('disabled')?.value }">
                        <div class="block">
                          <div class="flex">
                            <input formControlName="hunters" placeholder="Hunters" type="number"
                              [ngClass]="{'border-red-500': ctrl.get('hunters')?.invalid}">
                            <input formControlName="bucks" placeholder="Bucks" type="number"
                              [ngClass]="{'border-red-500': ctrl.get('bucks')?.invalid}">
                            <input formControlName="does" placeholder="Does" type="number"
                              [ngClass]="{'border-red-500': ctrl.get('does')?.invalid}">
                            <input formControlName="quota" placeholder="Quota" type="number">
                          </div>
                          <div class="flex">
                            <select formControlName="weapon" class="bg-gray-900"
                                [ngClass]="{'border-red-500': ctrl.get('weapon')?.invalid}">
                              <option value="">Weapon</option>
                              @for (w of data.weapons; track w.id) {
                                <option [value]="w.id">{{ w.name }}</option>
                              }
                            </select>
                            <div class="flex items-center ps-3">
                              <input formControlName="bonus" id="bonus{{ $index }}" type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500">
                              <label for="bonus{{ $index }}"
                                class="w-full py-3 ms-2 text-sm font-medium text-gray-300">Bonus/Quota</label>
                            </div>
                            <div class="flex items-center ps-3">
                              <input formControlName="buckonly" id="buckonly{{ $index }}" type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500">
                              <label for="buckonly{{ $index }}"
                                class="w-full py-3 ms-2 text-sm font-medium text-gray-300">Buck Only</label>
                            </div>
                            <div class="flex items-center ps-3">
                              <input formControlName="qualitybuck" id="qualitybuck{{ $index }}" type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500">
                              <label for="qualitybuck{{ $index }}"
                                class="w-full py-3 ms-2 text-sm font-medium text-gray-300">Quality Buck</label>
                            </div>
                            <div class="flex items-center ps-3">
                              <input formControlName="eithersex" id="eithersex{{ $index }}" type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500">
                              <label for="eithersex{{ $index }}"
                                class="w-full py-3 ms-2 text-sm font-medium text-gray-300">Either Sex</label>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="align-text-bottom">
                        @if ($last) {
                          <a class="ml-1 text-xl" type="button" (click)="add()" href="javascript:;">
                            <ng-icon name="heroPlusCircle" class="me-2"></ng-icon>
                          </a>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
              <div>
                @if (singleHuntsForm.controls.hunts.controls.length > 0) {
                  <button type="submit" class="btn btn-primary m-2" [disabled]="singleHuntsForm.invalid">
                    Save {{ singleHuntsForm.controls.hunts.controls.length }} Hunt(s)
                  </button>
                }
              </div>
            </form>
            <!-- <pre>{{ singleHuntsForm.value | json }}</pre> -->
          </div>
        }
      </div>
    }
  `
})
export class AddHuntsComponent implements OnInit {

  private _formBuilder = inject(FormBuilder);
  private _store = inject(Store<AppStateInterface>);
  private _cdr = inject(ChangeDetectorRef);

  mode = signal<'bulk' | 'single'>('bulk');

  scrapedHunts = signal<ScrapedHunt[]>([]);
  wmas = signal<Wma[]>([]);
  seasons = signal<Season[]>([]);
  weapons = signal<Weapon[]>([]);

  isLoading$ = this._store.select(adminSelectors.selectAdminStateLoading);

  auxData$ = this._store.select(filterSelectors.selectFiltersAuxData)
    .pipe(
      tap((aux) => {
        this.wmas.set(aux?.wmas!);
        this.seasons.set(aux?.seasons!);
        this.weapons.set(aux?.weapons!);
      })
    );

  scrapedHunts$ = this._store.select(adminSelectors.selectScrapedHunts);

  bulkHuntsForm = this._formBuilder.group({
    season: ['', [Validators.required]],
    hunts: this._formBuilder.array([])
  });

  singleHuntsForm = this._formBuilder.group({
    season: ['', [Validators.required]],
    hunts: this._formBuilder.array([])
  });

  ngOnInit(): void {
    this._store.dispatch(adminActions.enterAddHuntsPage());
    this._store.dispatch(adminActions.loadScrapedHunts());
  }

  switchSingle() {
    this.mode.set('single');
    if (this.singleHuntsForm.controls.hunts.controls.length === 0) {
      this.add();
    }
    this._cdr.detectChanges();
  }

  add() {
    const huntsFormArray = this.singleHuntsForm.get("hunts") as FormArray;
    huntsFormArray.push(
      this._formBuilder.group({
        _uniq: [Math.round(Math.random() * 100000000)],
        wma: ['', [Validators.required]],
        details: ['', [Validators.required]],
        start: ['', [Validators.required]],
        end: ['', [Validators.required]],
        hunters: ['', [Validators.required]],
        bucks: ['', [Validators.required]],
        does: ['', [Validators.required]],
        quota: [''],
        weapon: ['', [Validators.required]],
        bonus: [''],
        buckonly: [''],
        qualitybuck: [''],
        eithersex: [''],
        disabled: [false]
      })
    );
    this._cdr.detectChanges();
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
      const huntsFormArray = this.bulkHuntsForm.controls.hunts as FormArray;
      this.scrapedHunts().forEach((scrapedHunt) => {
        huntsFormArray.push(
          this._formBuilder.group({
            _uniq: [Math.round(Math.random() * 100000000)],
            wma: [this._findWma(scrapedHunt.wmaName), [Validators.required]],
            details: [scrapedHunt.details, [Validators.required]],
            start: [scrapedHunt.startdate, [Validators.required]],
            end: [scrapedHunt.enddate, [Validators.required]],
            hunters: [scrapedHunt.hunterCount, [Validators.required]],
            bucks: [scrapedHunt.bucks, [Validators.required]],
            does: [scrapedHunt.does, [Validators.required]],
            quota: [''],
            weapon: [this._findWeapon(scrapedHunt.weapon), [Validators.required]],
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

  remove(index: number, undo?: boolean) {
    const huntsFormArray = this.bulkHuntsForm.get("hunts") as FormArray;
    huntsFormArray.controls[index].get("disabled")?.setValue(undo ? false : true);
    const group = huntsFormArray.controls[index] as FormGroup;
    if (undo) {
      group.enable();
    } else {
      group.disable();
    }
    this._cdr.detectChanges();
  }

  save(isBulk: boolean) {
    const payload = isBulk ? this.bulkHuntsForm.value : this.singleHuntsForm.value;
    console.log(payload);
    this._store.dispatch(adminActions.addHunts({ seasonId: payload.season!, newHunts: payload.hunts! }));
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

  private _findWeapon(weaponName: string): number | undefined {
    const found = this.weapons().find((weapon) => weapon.name.toLowerCase() === weaponName.toLowerCase());
    if (found) {
      return found.id;
    }
    return undefined;
  }

}
