import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, map, Observable, throwError } from "rxjs";
import { AlertService } from "../services/alert.service";

export function jwtInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const jwtToken = sessionStorage.getItem('Authorization');
    if (jwtToken) {
        req = req.clone({
            setHeaders: {
                'Authorization': jwtToken
            }
        });
    }

    return next(req).pipe(
        map(event => {
            if (event.type === HttpEventType.Response) {
                const authHeader = event.headers.get('Authorization');
                if (authHeader)
                    sessionStorage.setItem('Authorization', authHeader);
            }
            return event;
        })
    )
}

export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    return next(req).pipe(
        catchError((err: HttpErrorResponse) => {
            console.error(`HTTP error\nURL: ${err.url}\nStatus: ${err.status}\nResult: ${err.error.result}`);
            return throwError(() => err);
        }));
}

export function serverAvailabilityInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const alertService = inject(AlertService);
    return next(req).pipe(
        catchError((err: HttpErrorResponse) => {
            if (err.status === 0)
                alertService.displayError("Server is unavailable, please try again later.");
            return throwError(() => err);
        })
    );
}
