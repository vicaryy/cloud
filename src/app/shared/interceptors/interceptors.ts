import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest, HttpStatusCode } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { AlertService } from "../services/alert.service";

export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const alertService = inject(AlertService);
    return next(req).pipe(
        tap(event => {
        }));
}
