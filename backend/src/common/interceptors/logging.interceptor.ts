import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor<ExecutionContext, CallHandler> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const body = request.body;
    
    console.log(`🔍 Incoming Request: ${method} ${url}`);
    console.log('📦 Request Body:', body);
    
    const now = Date.now();
    
    return next.handle().pipe(
      tap({
        next: (response) => {
          const duration = Date.now() - now;
          console.log(`✅ Response: ${method} ${url} - ${duration}ms`);
          console.log('📤 Response Body:', response);
        },
        error: (error) => {
          const duration = Date.now() - now;
          console.log(`❌ Error: ${method} ${url} - ${duration}ms`);
          console.log('🚨 Error Details:', error.response || error);
        },
      }),
    );
  }
}