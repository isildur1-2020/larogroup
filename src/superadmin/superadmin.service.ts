import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RoleService } from 'src/role/role.service';
import { CompanyService } from '../company/company.service';
import { CreateSuperadminDto } from './dto/create-superadmin.dto';
import { UpdateSuperadminDto } from './dto/update-superadmin.dto';
import { Superadmin, SuperadminDocument } from './entities/superadmin.entity';
import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class SuperadminService {
  constructor(
    @InjectModel(Superadmin.name)
    private superadminModel: Model<SuperadminDocument>,
    @Inject(RoleService)
    private roleService: RoleService,
    @Inject(CompanyService)
    private companyservice: CompanyService,
  ) {}

  async create(createSuperadminDto: CreateSuperadminDto): Promise<Superadmin> {
    try {
      const { role, company } = createSuperadminDto;
      await this.roleService.documentExists(role);
      await this.companyservice.documentExists(company);
      const newSuperadmin = new this.superadminModel(createSuperadminDto);
      const superadminCreated = await newSuperadmin.save();
      console.log('Superadmin created successfully');
      return superadminCreated;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<Superadmin[]> {
    try {
      const superadminsFound = await this.superadminModel
        .find()
        .populate('role')
        .populate('company')
        .exec();
      console.log('Superadmins found successfully');
      return superadminsFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    throw new NotFoundException();
  }

  async update(id: string, updateSuperadminDto: UpdateSuperadminDto) {
    try {
      await this.superadminModel.findByIdAndUpdate(id, updateSuperadminDto);
      console.log(`Superadmin with id ${id} was updated successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.superadminModel.findByIdAndDelete(id);
      console.log(`Superadmin with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
