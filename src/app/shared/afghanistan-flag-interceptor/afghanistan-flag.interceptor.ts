import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const COUNTRY_FLAG_TO_REPLACE = 'Islamic Republic of Afghanistan';
const AFGHANISTAN_FLAG_PNG = 'https://flagcdn.com/w320/af.png';

@Injectable()
export class AfghanistanFlagInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<unknown>) => {
        if (
          !(event instanceof HttpResponse) ||
          !Array.isArray(event.body) 
        ) {
          return event;
        }

        const body = event.body.map((country: any) => {
          if (country?.name.official === COUNTRY_FLAG_TO_REPLACE) {
            return {
              ...country,
              flags: { ...country.flags, png: AFGHANISTAN_FLAG_PNG },
            };
          }
          return country;
        });

        return event.clone({ body });
      }),
    );
  }
}

