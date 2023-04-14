import mongoose, { isValidObjectId } from 'mongoose';
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

  existsCategory = async (category_id: string) => {
    try {
      await this.categoryService.documentExists(category_id);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  };

  async transform(value: CreateEmployeeDto, metadata: ArgumentMetadata) {
    const { categories } = value;
    let newCategories = [];
    const moreThanOne = categories.includes(',');
    if (moreThanOne) {
      newCategories = categories.split(',');
      newCategories.forEach((category_id: string) => {
        if (!isValidObjectId(category_id)) {
          throw new BadRequestException(
            'The categories must be a valid mongo id',
          );
        }
        this.existsCategory(category_id);
      });
      if (newCategories.length > 2) {
        throw new BadRequestException('The categories must be less than two');
      }
      return {
        ...value,
        categories: newCategories,
      };
    }

    if (!isValidObjectId(categories)) {
      throw new BadRequestException('The categories must be a valid mongo id');
    }
    await this.categoryService.documentExists(categories);
    return value;
  }
}
