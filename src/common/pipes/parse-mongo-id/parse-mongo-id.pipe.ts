import { isValidObjectId } from 'mongoose';
import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!isValidObjectId(value)) {
      const message = `${value} is not a valid mongo object id`;
      throw new BadRequestException(message);
    }
    return value;
  }
}
