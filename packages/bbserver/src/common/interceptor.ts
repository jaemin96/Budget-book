import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable, tap, catchError, throwError } from "rxjs";
import { CustomLogger } from "./log/custom-logger.service";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const info = ctx.getInfo();

    const userId = req?.user?.userId ?? "UnknownUser";
    const serviceName = info?.fieldName ?? "UnknownResolver";

    return next.handle().pipe(
      tap((result) => {
        // 성공 로그
        this.logger.debug(`📊 Result: ${JSON.stringify(result, null, 2)}`, serviceName, userId);
      }),
      catchError((err) => {
        // 실패 로그
        this.logger.error(`❌ Error: ${err.message}`, err.stack, serviceName, userId);
        return throwError(() => err);
      }),
    );
  }
}
