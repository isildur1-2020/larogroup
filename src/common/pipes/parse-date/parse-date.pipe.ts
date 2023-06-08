import * as moment from 'moment';
import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const paramName = metadata.data;
    const currentDate: moment.Moment = moment(value, 'YYYY-MM-DD', true);
    const isDateValid = currentDate.isValid();
    if (!isDateValid || value === undefined) {
      throw new BadRequestException(
        `${paramName} is not a valid date, use YYYY-MM-DD`,
      );
    }
    return value;
  }
}
