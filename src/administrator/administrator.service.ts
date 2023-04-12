import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CompanyService } from 'src/company/company.service';
import { administratorQuery } from './queries/administratorQuery';
import { SuperadminService } from 'src/superadmin/superadmin.service';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { CoordinatorService } from 'src/coordinator/coordinator.service';
import {
  Inject,
  forwardRef,
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
    @Inject(forwardRef(() => CoordinatorService))
    private coordinatorService: CoordinatorService,
    @Inject(forwardRef(() => SuperadminService))
    private superadminService: SuperadminService,
  ) {}

  async create(createAdministratorDto: CreateAdministratorDto): Promise<void> {
    try {
      const { company, password, username } = createAdministratorDto;
      // VALIDATE IF A COORDINATOR EXISTS WITH THIS USERNAME
      const coordinatorFound = await this.coordinatorService.findByUsername(
        username,
      );
      if (coordinatorFound !== null) {
        throw new BadRequestException('You cannot use this username');
      }
      // VALIDATE IF A SUPERADMIN EXISTS WITH THIS USERNAME
      const superadminFound = await this.superadminService.findByUsername(
        username,
      );
      if (superadminFound !== null) {
        throw new BadRequestException('You cannot use this username');
      }
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
        ...administratorQuery,
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
