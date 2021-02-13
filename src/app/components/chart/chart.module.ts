import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';
import * as drilldown from 'highcharts/modules/drilldown.src.js';

import { ChartComponent } from './chart.component';

@NgModule({
  imports: [ 
    CommonModule, 
    FormsModule, 
    IonicModule, 
    ChartModule
  ],
  providers: [  
    { 
      provide: HIGHCHARTS_MODULES, 
      useFactory: () => [drilldown] 
    }
  ],
  declarations: [ChartComponent],
  exports: [ChartComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class ChartComponentModule {}
