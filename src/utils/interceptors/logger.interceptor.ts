import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap, map } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('Before route handler');
    return next.handle().pipe(
      map((data) => {
        const { password, ...safeUser } = data;
        return safeUser;
      }),
    );
  }
}
