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
      const categoriesFound = await this.categoryModel
        .find()
        .populate('sub_company')
        .exec();
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
      await this.categoryModel.findByIdAndDelete(id);
      console.log(`Category with id ${id} was deleted succesfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
