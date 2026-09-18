import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { correlationIdInterceptor } from './app/core/interceptors/correlation-id.interceptor';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([correlationIdInterceptor])),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));