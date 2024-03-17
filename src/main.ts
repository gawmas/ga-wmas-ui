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
  heroXMark, heroBolt, heroMapPin, heroCalendar, heroWrenchScrewdriver,
  heroChartPie, heroSun, heroMoon, heroChevronDoubleDown, heroChevronDoubleUp,
  heroInformationCircle, heroNoSymbol, heroFaceFrown, heroBars3,
  heroChatBubbleBottomCenterText, heroDocumentText, heroCheckCircle,
  heroPencilSquare, heroClock, heroExclamationTriangle, heroArrowTopRightOnSquare,
  heroHandThumbUp, heroMap, heroGlobeAlt } from '@ng-icons/heroicons/outline';
import { heroCheckCircleSolid, heroXCircleSolid, heroExclamationTriangleSolid } from '@ng-icons/heroicons/solid';
import { AppStateInterface } from '_shared/model/store';
import { huntsReducers } from './app/store/hunts/hunts.reducers';
import { filterAuxDataReducers } from './app/store/filters/filters.reducers';
import { wxDetailsReducers } from './app/store/wxDetails/wxDetails.reducers';
import { FiltersEffects } from 'store/filters/filters.effects';
import { adminReducers } from 'store/admin/admin.reducers';
import { AdminEffects } from 'store/admin/admin.effects';
import { WxDetailsEffects } from 'store/wxDetails/wxDetails.effects';
import { successMapReducers } from 'store/successMap/successMap.reducers';
import { SuccessMapEffects } from 'store/successMap/successMap.effects';

const heroIcons = {
  heroTableCells,
  heroUsers,
  heroBarsArrowUp,
  heroArrowTrendingUp,
  heroStar,
  heroAdjustmentsHorizontal,
  heroXMark,
  heroBolt,
  heroMapPin,
  heroCalendar,
  heroWrenchScrewdriver,
  heroChartPie,
  heroSun,
  heroMoon,
  heroChevronDoubleDown,
  heroChevronDoubleUp,
  heroInformationCircle,
  heroNoSymbol,
  heroFaceFrown,
  heroBars3,
  heroChatBubbleBottomCenterText,
  heroDocumentText,
  heroCheckCircle,
  heroCheckCircleSolid,
  heroPencilSquare,
  heroClock,
  heroXCircleSolid,
  heroExclamationTriangleSolid,
  heroExclamationTriangle,
  heroArrowTopRightOnSquare,
  heroHandThumbUp,
  heroMap,
  heroGlobeAlt
};

const appReducers: ActionReducerMap<AppStateInterface> = {
  huntState: huntsReducers,
  filterAuxDataState: filterAuxDataReducers,
  adminState: adminReducers,
  wxDetailsState: wxDetailsReducers,
  successMapState: successMapReducers
};

export const appConfig: ApplicationConfig = {
  providers: [
    SHARED_MODULES,
    importProvidersFrom(
      HttpClientModule,
      RouterModule.forRoot(routes),
      StoreModule.forRoot(appReducers),
      EffectsModule.forRoot([
        HuntEffects,
        FiltersEffects,
        AdminEffects,
        WxDetailsEffects,
        SuccessMapEffects]),
      StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: false }),
      NgIconsModule.withIcons(heroIcons),
    )
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

