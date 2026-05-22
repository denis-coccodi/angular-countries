import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { PDropdownComponent } from './primeng-wrappers/dropdown/p-dropdown.component';
import { PHeaderComponent } from './primeng-wrappers/header/p-header.component';
import { PInputTextComponent } from './primeng-wrappers/input-text/p-input-text.component';
import { CountryCardComponent } from './ui/country-card/country-card.component';

@NgModule({
  declarations: [
    PDropdownComponent,
    PInputTextComponent,
    CountryCardComponent,
    PHeaderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    InputTextModule,
    SelectModule,
  ],
  exports: [PDropdownComponent, PInputTextComponent, PHeaderComponent, CountryCardComponent],
})
export class SharedModule {}

