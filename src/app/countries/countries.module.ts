import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CountryListComponent } from './country-list/country-list.component';
import { CountryCardComponent } from './country-card/country-card.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CountryListComponent,
    CountryCardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: CountryListComponent }
    ])
  ]
})
export class CountriesModule { }
