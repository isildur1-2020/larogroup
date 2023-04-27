import * as mongoose from 'mongoose';
import { Role } from './entities/role.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { EmployeeService } from 'src/employee/employee.service';
import { SuperadminService } from 'src/superadmin/superadmin.service';
import { CoordinatorService } from 'src/coordinator/coordinator.service';
import { AdministratorService } from 'src/administrator/administrator.service';
import {
  Inject,
  Injectable,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: mongoose.Model<Role>,
    @Inject(forwardRef(() => SuperadminService))
    private superadminService: SuperadminService,
    @Inject(forwardRef(() => AdministratorService))
    private administratorService: AdministratorService,
    @Inject(forwardRef(() => CoordinatorService))
    private coordinatorService: CoordinatorService,
    @Inject(forwardRef(() => VehicleService))
    private vehicleService: VehicleService,
    @Inject(forwardRef(() => EmployeeService))
    private employeeService: EmployeeService,
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

  async findOne(id: string): Promise<Role> {
    try {
      const roleFound = await this.roleModel.findById(id);
      if (roleFound === null) {
        throw new BadRequestException(`Role with id ${id} does not exists`);
      }
      console.log('Role found by id successfully');
      return roleFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
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
      // RESTRICT DELETE
      await this.employeeService.validateByRole(id);
      await this.vehicleService.validateByRole(id);
      await this.coordinatorService.validateByRole(id);
      await this.administratorService.validateByRole(id);
      await this.superadminService.validateByRole(id);
      await this.roleModel.findByIdAndDelete(id);
      console.log(`Rol with id ${id} deleted successfully`);
      return true;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
