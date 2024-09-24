import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor, loggingInterceptor, serverAvailabilityInterceptor } from './shared/interceptors/interceptors';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes), provideAnimationsAsync(), provideHttpClient(
        withInterceptors([jwtInterceptor, loggingInterceptor, serverAvailabilityInterceptor])),
    {
        provide: 'SocialAuthServiceConfig',
        useValue: {
            autoLogin: false,
            providers: [
                {
                    id: GoogleLoginProvider.PROVIDER_ID,
                    provider: new GoogleLoginProvider("400395304378-6vvb8q6ouglk0ne3k0tdtg77h7k848fq.apps.googleusercontent.com",
                        {
                            oneTapEnabled: false
                        }
                    )
                }
            ],
            onError: (error) => {
                console.error(error);
            }
        } as SocialAuthServiceConfig
    }
    ]
};
