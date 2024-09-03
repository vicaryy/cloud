import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest, HttpStatusCode } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { AlertService } from "../services/alert.service";

export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    return next(req).pipe(
        tap(event => {
            if (event.type === HttpEventType.Response) {
                console.log(req, 'returned a response with status: ', event.status);
            }
            console.log(event);

        }),
        catchError(error => {
            console.log("Był error");
            inject(AlertService).displayError('Błąd przy wykonywaniu zapytania do serwera');
            return throwError(() => error);
        }))
}
