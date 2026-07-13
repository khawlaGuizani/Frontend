import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

const API_PREFIX = '/api/';
const TOKEN_KEY = 'token';

const PUBLIC_AUTH_ROUTES = [
  '/api/auth/login',
  '/api/auth/register'
];

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {


  if (!req.url.includes('/api/')) {
  return next(req);
}


  if (PUBLIC_AUTH_ROUTES.some(route => req.url.includes(route))) {
    return next(req);
  }

  const token = localStorage.getItem(TOKEN_KEY);


  if (!token) {
    return next(req);
  }

  // 🔐 JWT
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
