import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { CompanyService } from '../company/company.service';
import { superadminQuery } from './queries/superadmin.query';
import { CreateSuperadminDto } from './dto/create-superadmin.dto';
import { UpdateSuperadminDto } from './dto/update-superadmin.dto';
import { CoordinatorService } from 'src/coordinator/coordinator.service';
import { Superadmin, SuperadminDocument } from './entities/superadmin.entity';
import { AdministratorService } from 'src/administrator/administrator.service';
import {
  Inject,
  Injectable,
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
    @Inject(ConfigService)
    private configService: ConfigService,
    @Inject(AdministratorService)
    private administratorService: AdministratorService,
    @Inject(CoordinatorService)
    private coordinatorService: CoordinatorService,
  ) {}

  async create(createSuperadminDto: CreateSuperadminDto): Promise<void> {
    throw new InternalServerErrorException('This endpoint is forbidden!');
    try {
      const { company, password, username } = createSuperadminDto;
      // VALIDATE IF AN ADMIN EXISTS WITH THIS USERNAME
      const adminFound = await this.administratorService.findByUsername(
        username,
      );
      if (adminFound !== null) {
        throw new BadRequestException('You cannot use this username');
      }
      // VALIDATE IF AN COORDINATOR EXISTS WITH THIS USERNAME
      const coordinatorFound = await this.coordinatorService.findByUsername(
        username,
      );
      if (coordinatorFound !== null) {
        throw new BadRequestException('You cannot use this username');
      }
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
    throw new InternalServerErrorException('This endpoint is forbidden!');
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
    throw new InternalServerErrorException('This endpoint is forbidden!');
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
    throw new InternalServerErrorException('This endpoint is forbidden!');
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

  async findById(id: string): Promise<Superadmin> {
    throw new InternalServerErrorException('This endpoint is forbidden!');
    try {
      const userFound = await this.superadminModel.findById(id);
      console.log('Superadmin found successfully');
      return userFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
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
