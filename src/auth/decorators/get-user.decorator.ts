import {
  ExecutionContext,
  createParamDecorator,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const userPayload: JwtPayload = req?.user;
  if (!userPayload) {
    throw new InternalServerErrorException('User payload not found');
  }
  if (!data) return userPayload;
  if (!userPayload?.[data]) {
    throw new InternalServerErrorException(
      `Attribute ${data} does not exists in user payload`,
    );
  }
  return userPayload[data]._id;
});
