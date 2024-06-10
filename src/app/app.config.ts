import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';

import { appRequestInterceptorProvider } from './core/interceptors/request.interceptor';
import { appResponseInterceptorProvider } from './core/interceptors/response.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()), 
    provideAnimationsAsync(),
    importProvidersFrom(HttpClientModule),
    appRequestInterceptorProvider,
    appResponseInterceptorProvider,
    
  ]
};
