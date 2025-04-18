import { HttpInterceptorFn } from '@angular/common/http';
import { isDevMode } from '@angular/core';

/**
 * Interceptor that enforces HTTPS by redirecting HTTP requests to HTTPS
 * in production environments
 */
export const enforceHttpsInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip HTTPS enforcement in development mode
  if (isDevMode()) {
    return next(req);
  }

  // Only process absolute URLs (not relative ones)
  if (req.url.startsWith('http://')) {
    // Create a new request with HTTPS
    const secureUrl = req.url.replace('http://', 'https://');
    const secureReq = req.clone({
      url: secureUrl
    });
    
    console.warn(`Interceptor redirected request from ${req.url} to ${secureUrl}`);
    return next(secureReq);
  }
  
  return next(req);
}; 