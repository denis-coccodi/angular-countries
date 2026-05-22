import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { PDropdownComponent } from './primeng-wrappers/dropdown/p-dropdown.component';
import { PInputTextComponent } from './primeng-wrappers/input-text/p-input-text.component';
import { PHeaderComponent } from './primeng-wrappers/header/p-header.component';

@NgModule({
  declarations: [
    PDropdownComponent,
    PInputTextComponent,
    PHeaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    InputTextModule,
    SelectModule
  ],
  exports: [
    PDropdownComponent,
    PInputTextComponent,
    PHeaderComponent
  ]
})
export class SharedModule { }
