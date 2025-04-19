import { Injectable, Inject, Optional, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';

// @Injectable()  // Remove this injectable decorator.  We'll provide this as a function.
export const AuthInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
) => {
    const authService = inject(AuthService);
    //const token = authService.getToken();

    // if (token) {
    //     const authReq = req.clone({
    //         setHeaders: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //     });
    //     return next(authReq);
    // }
    return next(req);
};
