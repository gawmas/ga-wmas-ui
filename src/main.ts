import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { routes } from 'app.routes';
import { HuntEffects } from 'store/hunts/hunts.effects';
import { SHARED_MODULES } from '@shared-imports';
import { NgIconsModule } from '@ng-icons/core';
import { heroTableCells, heroUsers, heroBarsArrowUp,
  heroArrowTrendingUp, heroStar, heroAdjustmentsHorizontal,
  heroXMark, heroBolt } from '@ng-icons/heroicons/outline';
import { AppStateInterface } from '_shared/model/store';
import { huntsReducers } from './app/store/hunts/hunts.reducers';
import { filterAuxDataReducers } from './app/store/filters/filters.reducers';
import { FiltersEffects } from 'store/filters/filters.effects';

const heroIcons = {
  heroTableCells,
  heroUsers,
  heroBarsArrowUp,
  heroArrowTrendingUp,
  heroStar,
  heroAdjustmentsHorizontal,
  heroXMark,
  heroBolt
};

const appReducers: ActionReducerMap<AppStateInterface> = {
  huntState: huntsReducers,
  filterAuxDataState: filterAuxDataReducers
};

export const appConfig: ApplicationConfig = {
  providers: [
    SHARED_MODULES,
    importProvidersFrom(
      HttpClientModule,
      RouterModule.forRoot(routes),
      StoreModule.forRoot(appReducers),
      EffectsModule.forRoot([HuntEffects, FiltersEffects]),
      StoreDevtoolsModule.instrument({ maxAge: 25 }),
      NgIconsModule.withIcons(heroIcons),
    )
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

