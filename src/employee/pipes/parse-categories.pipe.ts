import { isValidObjectId } from 'mongoose';
import { removeDuplicates } from 'src/utils/utils';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { CategoryService } from 'src/category/category.service';
import {
  Inject,
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseCategoriesPipe implements PipeTransform {
  constructor(
    @Inject(CategoryService)
    private categoryService: CategoryService,
  ) {}

  validateMongoId = (id: string) => {
    const isValidMongoId = isValidObjectId(id);
    if (!isValidMongoId) {
      throw new BadRequestException('The categories must be a valid mongo id');
    }
  };

  existsCategory = async (category_id: string): Promise<void> => {
    try {
      await this.categoryService.documentExists(category_id);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  };

  async transform(value: CreateEmployeeDto, metadata: ArgumentMetadata) {
    const { categories } = value;
    if (!categories) return value;
    let newCategories = [];
    const areMoreThanOne = categories.includes(',');
    if (areMoreThanOne) {
      newCategories = categories.split(',');
      newCategories = removeDuplicates(newCategories);
      if (newCategories.length > 2) {
        throw new BadRequestException('Two categories is the maximum');
      }
      for (let category_id of newCategories) {
        this.validateMongoId(category_id);
        await this.existsCategory(category_id);
      }
      return {
        ...value,
        categories: newCategories,
      };
    }
    this.validateMongoId(categories);
    await this.existsCategory(categories);
    return value;
  }
}
