import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';
import * as drilldown from 'highcharts/modules/drilldown.src.js';
import { ChartDrilldownComponentModule } from '../../components/chart-drilldown/chart-drilldown.module';

import { IonicModule } from '@ionic/angular';
import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    ChartDrilldownComponentModule,
    ChartModule
  ],
  providers: [  
    { 
      provide: HIGHCHARTS_MODULES, 
      useFactory: () => [drilldown] 
    }
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
