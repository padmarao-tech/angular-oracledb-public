import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { appRequestInterceptorProvider } from './core/interceptors/request.interceptor';
import { appResponseInterceptorProvider } from './core/interceptors/response.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([
        appRequestInterceptorProvider,
        appResponseInterceptorProvider,
      ])
    )

  ]
};
