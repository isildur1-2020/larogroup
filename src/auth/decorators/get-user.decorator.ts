import { JwtPayload } from '../interfaces/jwt-payload.interface';
import {
  ExecutionContext,
  createParamDecorator,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const userPayload: JwtPayload = req?.user;
  if (!userPayload) {
    throw new InternalServerErrorException('User payload not found');
  }
  if (!data) return userPayload;
  if (!userPayload?.[data]) {
    throw new InternalServerErrorException(
      `Prop ${data} does not exists in payload`,
    );
  }
  return userPayload?.[data]?._id;
});
