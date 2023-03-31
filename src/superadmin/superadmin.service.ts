import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CompanyService } from '../company/company.service';
import { CreateSuperadminDto } from './dto/create-superadmin.dto';
import { UpdateSuperadminDto } from './dto/update-superadmin.dto';
import { Superadmin, SuperadminDocument } from './entities/superadmin.entity';
import { superadminQuery } from './queries/superadmin.query';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class SuperadminService {
  constructor(
    @InjectModel(Superadmin.name)
    private superadminModel: mongoose.Model<SuperadminDocument>,
    @Inject(CompanyService)
    private companyservice: CompanyService,
  ) {}

  async create(createSuperadminDto: CreateSuperadminDto): Promise<void> {
    throw new InternalServerErrorException('This endpoint is forbidden!');
    try {
      const { company, password } = createSuperadminDto;
      await this.companyservice.documentExists(company);
      const newSuperadmin = new this.superadminModel(createSuperadminDto);
      newSuperadmin.password = bcrypt.hashSync(password, 10);
      await newSuperadmin.save();
      console.log('Superadmin created successfully');
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(companyId: string): Promise<Superadmin[]> {
    try {
      const superadminsFound = await this.superadminModel.aggregate([
        {
          $match: {
            company: new mongoose.Types.ObjectId(companyId),
          },
        },
        ...superadminQuery,
      ]);
      console.log('Superadmins found successfully');
      return superadminsFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.superadminModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(
          `Superadmin with id ${id} does not exists`,
        );
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findByUsername(username: string): Promise<Superadmin> {
    try {
      const userFound = await this.superadminModel
        .findOne({ username })
        .populate('role', 'name')
        .populate('company', 'name');
      return userFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    throw new NotFoundException();
  }

  async update(id: string, updateSuperadminDto: UpdateSuperadminDto) {
    throw new InternalServerErrorException('This endpoint is forbidden!');
    try {
      await this.documentExists(id);
      await this.superadminModel.findByIdAndUpdate(id, updateSuperadminDto);
      console.log(`Superadmin with id ${id} was updated successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string): Promise<void> {
    throw new InternalServerErrorException('This endpoint is forbidden!');
    try {
      await this.documentExists(id);
      await this.superadminModel.findByIdAndRemove(id);
      console.log(`Superadmin with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
