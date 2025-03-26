import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from "@nestjs/common";
import { ZodError } from "zod";

@Catch(ZodError)
export class ZodExceptionFilter<T extends ZodError> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
  
    response.status(HttpStatus.BAD_REQUEST).json({
      message: exception.errors[0].message,
      error: "Bad Request",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}