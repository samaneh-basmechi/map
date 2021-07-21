import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeRoutingModule} from './home-routing.module';
import {MapService, NgxMapboxGLModule} from 'ngx-mapbox-gl';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {IS_LOGIN, STATUS} from './shared-state';
import {Status} from '../../core/models/status.model';
import {COMPONENTS} from './components';
import {environment} from '../../../environments/environment';
import {MaterialModule} from '../../shared/material.module';

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NgxMapboxGLModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapboxToken,
      geocoderAccessToken: environment.mapboxToken
    })
  ],
  providers: [MapService, {
    provide: STATUS, useFactory: () => {
      return new BehaviorSubject<Status>(null);
    }
  },
    {
      provide: IS_LOGIN, useFactory: () => {
        return new BehaviorSubject<boolean>(false);
      }
    }
  ]
})
export class HomeModule {
}
