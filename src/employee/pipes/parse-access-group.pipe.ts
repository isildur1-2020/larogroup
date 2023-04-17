import { isValidObjectId } from 'mongoose';
import { removeDuplicates } from 'src/utils/utils';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { AccessGroupService } from 'src/access_group/access_group.service';
import {
  Inject,
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseAccessGroupPipe implements PipeTransform {
  constructor(
    @Inject(AccessGroupService)
    private accessGroupService: AccessGroupService,
  ) {}

  existsAccessGroup = async (id: string) => {
    try {
      await this.accessGroupService.documentExists(id);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  };

  validateMongoId = (id: string) => {
    const isValidMongoId = isValidObjectId(id);
    if (!isValidMongoId) {
      throw new BadRequestException(
        'The access group must be a valid mongo id',
      );
    }
  };

  async transform(value: CreateEmployeeDto, metadata: ArgumentMetadata) {
    const { access_group } = value;
    if (!access_group) return value;
    let newAccesGroup = [];
    const areMoreThanOne = access_group.includes(',');
    if (areMoreThanOne) {
      newAccesGroup = access_group.split(',');
      newAccesGroup = removeDuplicates(newAccesGroup);
      for (let access_group_id of newAccesGroup) {
        this.validateMongoId(access_group_id);
        await this.existsAccessGroup(access_group_id);
      }
      return {
        ...value,
        access_group: newAccesGroup,
      };
    }
    this.validateMongoId(access_group);
    await this.accessGroupService.documentExists(access_group);
    return value;
  }
}
