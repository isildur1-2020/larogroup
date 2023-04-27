import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { RoleService } from 'src/role/role.service';
import { superadminQuery } from './queries/superadmin.query';
import { CreateSuperadminDto } from './dto/create-superadmin.dto';
import { UpdateSuperadminDto } from './dto/update-superadmin.dto';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { CoordinatorService } from 'src/coordinator/coordinator.service';
import { Superadmin, SuperadminDocument } from './entities/superadmin.entity';
import { AdministratorService } from 'src/administrator/administrator.service';
import {
  Inject,
  Injectable,
  forwardRef,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class SuperadminService {
  constructor(
    @InjectModel(Superadmin.name)
    private superadminModel: mongoose.Model<SuperadminDocument>,
    @Inject(forwardRef(() => AdministratorService))
    private administratorService: AdministratorService,
    @Inject(forwardRef(() => CoordinatorService))
    private coordinatorService: CoordinatorService,
    @Inject(ConfigService)
    private configService: ConfigService,
    @Inject(forwardRef(() => RoleService))
    private roleService: RoleService,
  ) {}

  async create(createSuperadminDto: CreateSuperadminDto): Promise<void> {
    try {
      const { password, username, root_password } = createSuperadminDto;
      if (root_password !== this.configService.get('ROOT_PASSWORD')) {
        throw new ForbiddenException('You need a unique credential');
      }
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
      const roleFound = await this.roleService.findOneByName(
        ValidRoles.superadmin,
      );
      const newSuperadmin = new this.superadminModel({
        ...createSuperadminDto,
        role: roleFound._id,
      });
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
        .populate('role', 'name');
      return userFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findById(id: string): Promise<Superadmin> {
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
    try {
      await this.documentExists(id);
      await this.superadminModel.findByIdAndRemove(id);
      console.log(`Superadmin with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async validateByRole(role: string): Promise<void> {
    try {
      const superadminsFound = await this.superadminModel.find({ role });
      if (superadminsFound.length > 0) {
        throw new BadRequestException('There are associated superadmins');
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
