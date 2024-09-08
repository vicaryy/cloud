import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandlerFn, HttpHeaders, HttpRequest, HttpStatusCode } from "@angular/common/http";
import { catchError, map, Observable, tap, throwError } from "rxjs";

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
            console.log(err);

            console.error(`HTTP error\nURL: ${err.url}\nStatus: ${err.status}\nResult: ${err.error.result}`);
            return throwError(() => err);
        }));
}
