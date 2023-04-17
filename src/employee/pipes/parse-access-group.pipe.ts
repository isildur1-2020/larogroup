import { isValidObjectId } from 'mongoose';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import {
  Inject,
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { removeDuplicates } from 'src/utils/utils';
import { AccessGroupService } from 'src/access_group/access_group.service';

@Injectable()
export class ParseAccessGroupPipe implements PipeTransform {
  constructor(
    @Inject(AccessGroupService)
    private accessGroupService: AccessGroupService,
  ) {}

  validateMongoId = (id: string) => {
    const isValidMongoId = isValidObjectId(id);
    if (!isValidMongoId) {
      throw new BadRequestException(
        'The access_group must be a valid mongo id',
      );
    }
  };

  existsAccessGroup = async (access_group_id: string) => {
    try {
      await this.accessGroupService.documentExists(access_group_id);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  };

  async transform(value: CreateEmployeeDto, metadata: ArgumentMetadata) {
    const { access_group } = value;
    let newAccesGroup = [];
    const areMoreThanOne = access_group.includes(',');
    if (areMoreThanOne) {
      newAccesGroup = access_group.split(',');
      newAccesGroup = removeDuplicates(newAccesGroup);
      newAccesGroup.forEach((access_group_id: string) => {
        this.validateMongoId(access_group_id);
        this.existsAccessGroup(access_group_id);
      });
      return {
        ...value,
        access_group: newAccesGroup,
      };
    }
    this.validateMongoId(access_group);
    this.existsAccessGroup(access_group);
    return value;
  }
}
