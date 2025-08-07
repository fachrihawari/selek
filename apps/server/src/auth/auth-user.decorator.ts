import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import type { TUserSafe } from '~/users/users.schema';

export const AuthUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return { ...request.user, password: undefined } as TUserSafe;
  },
);
