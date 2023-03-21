import { Model } from 'mongoose';
import { Role } from './entities/role.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
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

  findOne(id: number) {
    throw new NotFoundException();
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<boolean> {
    try {
      await this.roleModel.findByIdAndDelete(id);
      console.log(`Rol with id ${id} deleted successfully`);
      return true;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
