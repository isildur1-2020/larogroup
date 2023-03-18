import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Category, CategoryDocument } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const newCategory = new this.categoryModel(createCategoryDto);
      const categorySaved = await newCategory.save();
      console.log('Category saved successfully');
      return categorySaved;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      const categoriesFound = await this.categoryModel.find();
      console.log('Categories found successfully');
      return categoriesFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    throw new NotFoundException();
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    try {
      await this.categoryModel.findByIdAndDelete({ _id: id });
      console.log(`Category with id ${id} was deleted succesfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
