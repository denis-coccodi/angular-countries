import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AfghanistanFlagInterceptor } from './shared/afghanistan-flag-interceptor/afghanistan-flag.interceptor';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AfghanistanFlagInterceptor, multi: true },
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
