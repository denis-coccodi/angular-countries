import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PMultiselectComponent } from '../shared/primeng-wrappers/multiselect/p-multiselect.component';
import { SharedModule } from '../shared/shared.module';
import { CompareCountriesComponent } from './compare-countries.component';

@NgModule({
  declarations: [
    CompareCountriesComponent,
  ],
  imports: [
    PMultiselectComponent,
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: CompareCountriesComponent }
    ])
  ]
})
export class CompareCountriesModule { }
