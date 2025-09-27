/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let code = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: any = null;

    if (exception instanceof HttpException) {
      code = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object') {
        const r = res as Record<string, any>;
        message = r.message || message;
        details = r;
      }
    } else if (exception instanceof MongoError) {
      if (exception.code === 11000) {
        code = HttpStatus.CONFLICT;
        message = 'Duplicate key error';
        details = (exception as any).keyValue ?? null;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      details = exception.stack;
    }

    response.status(code).json({
      code,
      message,
      details,
    });
  }
}
