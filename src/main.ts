import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { routes } from 'app.routes';
import { HuntEffects } from 'store/effects';
import { AppInterface } from 'store/model';
import { SHARED_MODULES } from '@shared-imports';
import { huntsReducers } from 'store/reducers';
import { NgIconsModule } from '@ng-icons/core';
import { heroTableCells, heroUsers, heroBarsArrowUp,
  heroArrowTrendingUp, heroStar, heroAdjustmentsHorizontal,
  heroXMark } from '@ng-icons/heroicons/outline';

const heroIcons = {
  heroTableCells,
  heroUsers,
  heroBarsArrowUp,
  heroArrowTrendingUp,
  heroStar,
  heroAdjustmentsHorizontal,
  heroXMark
};

const appReducers: ActionReducerMap<AppInterface> = {
  huntState: huntsReducers,
};

export const appConfig: ApplicationConfig = {
  providers: [
    SHARED_MODULES,
    importProvidersFrom(
      HttpClientModule,
      RouterModule.forRoot(routes),
      StoreModule.forRoot(appReducers),
      EffectsModule.forRoot(HuntEffects),
      StoreDevtoolsModule.instrument({ maxAge: 25 }),
      NgIconsModule.withIcons(heroIcons),
    )
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

