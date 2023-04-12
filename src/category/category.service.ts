import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './entities/category.entity';
import { SubCompanyService } from 'src/sub_company/sub_company.service';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
    @Inject(SubCompanyService)
    private subCompanyService: SubCompanyService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const { sub_company } = createCategoryDto;
      await this.subCompanyService.documentExists(sub_company);
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
      const categoriesFound = await this.categoryModel.aggregate([
        {
          $project: {
            sub_company: 0,
            updatedAt: 0,
          },
        },
      ]);
      console.log('Categories found successfully');
      return categoriesFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.categoryModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(`Category with id ${id} does not exists`);
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    throw new NotFoundException();
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    try {
      await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.categoryModel.findByIdAndDelete(id);
      console.log(`Category with id ${id} was deleted succesfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
