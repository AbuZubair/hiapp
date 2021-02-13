import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { CreateVictimPage } from '../../modal/create-victim/create-victim.page';
import { FileSizeFormatPipe } from '../../modal/create-victim/file-size-format.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage,CreateVictimPage,FileSizeFormatPipe]
})
export class HomePageModule {}
