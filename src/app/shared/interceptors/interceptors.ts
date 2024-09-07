import { HttpEvent, HttpEventType, HttpHandlerFn, HttpHeaders, HttpRequest, HttpStatusCode } from "@angular/common/http";
import { map, Observable } from "rxjs";

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
