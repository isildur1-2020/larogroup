import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CompanyService } from 'src/company/company.service';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  Administrator,
  AdministratorDocument,
} from './entities/administrator.entity';

@Injectable()
export class AdministratorService {
  constructor(
    @InjectModel(Administrator.name)
    private administratorModel: mongoose.Model<AdministratorDocument>,
    @Inject(CompanyService)
    private companyService: CompanyService,
  ) {}

  async create(createAdministratorDto: CreateAdministratorDto): Promise<void> {
    try {
      const { company, password } = createAdministratorDto;
      await this.companyService.documentExists(company);
      const newAdministrator = new this.administratorModel(
        createAdministratorDto,
      );
      newAdministrator.password = bcrypt.hashSync(password, 10);
      await newAdministrator.save();
      console.log('Administrator created succesfully');
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(companyId: string): Promise<Administrator[]> {
    try {
      const administratorsFound = await this.administratorModel.aggregate([
        {
          $match: {
            company: new mongoose.Types.ObjectId(companyId),
          },
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField: '_id',
            as: 'role',
            pipeline: [
              {
                $project: {
                  createdAt: 0,
                  updatedAt: 0,
                },
              },
            ],
          },
        },
        { $unwind: '$role' },
        {
          $lookup: {
            from: 'companies',
            localField: 'company',
            foreignField: '_id',
            as: 'company',
            pipeline: [
              {
                $project: {
                  createdAt: 0,
                  updatedAt: 0,
                  city: 0,
                  country: 0,
                },
              },
            ],
          },
        },
        { $unwind: '$company' },
        {
          $project: {
            is_active: 0,
            password: 0,
            updatedAt: 0,
          },
        },
      ]);
      console.log('Administrator found successfully');
      return administratorsFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findByUsername(username: string): Promise<Administrator> {
    try {
      const userFound = await this.administratorModel
        .findOne({ username })
        .populate('role', 'name')
        .populate('company', 'name');
      return userFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findById(id: string): Promise<Administrator> {
    try {
      const userFound = await this.administratorModel.findById(id);
      console.log('Administrator found successfully');
      return userFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.administratorModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(
          `Administrator with id ${id} does not exists`,
        );
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
    updateAdministratorDto: UpdateAdministratorDto,
  ): Promise<void> {
    try {
      await this.documentExists(id);
      await this.administratorModel.findByIdAndUpdate(
        id,
        updateAdministratorDto,
      );
      console.log(`Administrator with id ${id} was updated successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.documentExists(id);
      await this.administratorModel.findByIdAndDelete(id);
      console.log(`Administrator with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
