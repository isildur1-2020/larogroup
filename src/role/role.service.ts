import { Model } from 'mongoose';
import { Role } from './entities/role.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const newRole = new this.roleModel(createRoleDto);
      const roleSaved = await newRole.save();
      console.log('Role created successfully');
      return roleSaved;
    } catch (err) {
      console.log(err.message);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<Role[]> {
    try {
      const rolesFound = await this.roleModel.find();
      console.log('Roles found successfully');
      return rolesFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.roleModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(`Role with id ${id} does not exists`);
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: string) {
    throw new NotFoundException();
  }

  async findOneByName(name: string): Promise<Role> {
    try {
      const roleFound = await this.roleModel.findOne({ name });
      if (roleFound === null) {
        throw new BadRequestException('This role does not exists');
      }
      return roleFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<void> {
    try {
      await this.documentExists(id);
      await this.roleModel.findByIdAndUpdate(id, updateRoleDto);
      console.log(`Rol with id ${id} updated successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await this.documentExists(id);
      await this.roleModel.findByIdAndDelete(id);
      console.log(`Rol with id ${id} deleted successfully`);
      return true;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
