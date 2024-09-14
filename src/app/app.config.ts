import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { provideServiceWorker } from '@angular/service-worker';
import { jwtInterceptor, loggingInterceptor } from './shared/interceptors/interceptors';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export const appConfig: ApplicationConfig = {
    providers: [{provide: LocationStrategy, useClass: HashLocationStrategy} ,provideRouter(routes), provideAnimationsAsync(), provideHttpClient(
        withInterceptors([jwtInterceptor, loggingInterceptor])),
    // ), provideServiceWorker('ngsw-worker.js', {
    //     enabled: !isDevMode(),
    //     registrationStrategy: 'registerWhenStable:30000'
    // }), provideServiceWorker('ngsw-worker.js', {
    //     enabled: !isDevMode(),
    //     registrationStrategy: 'registerWhenStable:30000'
    // }),
    {
        provide: 'SocialAuthServiceConfig',
        useValue: {
          autoLogin: false,
          providers: [
            {
              id: GoogleLoginProvider.PROVIDER_ID,
              provider: new GoogleLoginProvider("400395304378-6vvb8q6ouglk0ne3k0tdtg77h7k848fq.apps.googleusercontent.com")
            }
          ],
          onError: (error) => {
            console.error(error);
          }
        } as SocialAuthServiceConfig
      }
]
};
