import {
  ExecutionContext,
  createParamDecorator,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  if (!req?.user) {
    throw new InternalServerErrorException('User payload not found');
  }
  if (!data) return req.user;
  if (!req.user?.[data]) {
    throw new InternalServerErrorException(
      `Attribute ${data} does not exists in user payload`,
    );
  }
  return req.user?.[data];
});
