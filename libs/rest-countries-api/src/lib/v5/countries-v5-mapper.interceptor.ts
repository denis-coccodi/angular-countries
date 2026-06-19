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
import { mapV5Response } from './country.mapper';
import { V5Response } from './v5-response.model';

const V5_PATH = '/countries/v5';

/**
 * Normalizes REST Countries **v5** responses into the internal country shape.
 *
 * v5 returns `{ data: { objects, meta } }`; the rest of the app (services,
 * stores, the {@link AfghanistanFlagInterceptor}) expects a plain array of
 * internal countries. This interceptor unwraps and maps the envelope so all
 * downstream consumers keep working unchanged.
 *
 * Ordering matters: register this **after** the AfghanistanFlagInterceptor so
 * that on the response path (which runs interceptors in reverse) this one maps
 * first and the Afghanistan override then sees the already-mapped array.
 */
@Injectable()
export class CountriesV5MapperInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (!req.url.includes(V5_PATH)) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      map((event: HttpEvent<unknown>) => {
        if (!(event instanceof HttpResponse)) {
          return event;
        }

        const body = event.body as V5Response | undefined;
        if (!Array.isArray(body?.data?.objects)) {
          return event;
        }

        return event.clone({ body: mapV5Response(body) });
      }),
    );
  }
}
