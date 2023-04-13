import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RoleService } from 'src/role/role.service';
import { CampusService } from 'src/campus/campus.service';
import { employeeQuery } from 'src/common/queries/employee';
import { coordinatorQuery } from './queries/coordinatorQuery';
import { EmployeeService } from 'src/employee/employee.service';
import { CreateCoordinatorDto } from './dto/create-coordinator.dto';
import { UpdateCoordinatorDto } from './dto/update-coordinator.dto';
import { SuperadminService } from 'src/superadmin/superadmin.service';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { SubCompanyService } from 'src/sub_company/sub_company.service';
import { AdministratorService } from 'src/administrator/administrator.service';
import {
  Inject,
  Injectable,
  BadRequestException,
  forwardRef,
} from '@nestjs/common';
import {
  Coordinator,
  CoordinatorDocument,
} from './entities/coordinator.entity';

@Injectable()
export class CoordinatorService {
  constructor(
    @InjectModel(Coordinator.name)
    private coordinatorModel: mongoose.Model<CoordinatorDocument>,
    @Inject(EmployeeService)
    private employeeService: EmployeeService,
    @Inject(SubCompanyService)
    private subCompanyService: SubCompanyService,
    @Inject(CampusService)
    private campusService: CampusService,
    @Inject(forwardRef(() => AdministratorService))
    private administratorService: AdministratorService,
    @Inject(forwardRef(() => SuperadminService))
    private superadminService: SuperadminService,
    @Inject(RoleService)
    private roleService: RoleService,
  ) {}

  async create(createCoordinatorDto: CreateCoordinatorDto): Promise<void> {
    try {
      const { employee, sub_company, campus, password, username } =
        createCoordinatorDto;
      // VALIDATE IF AN ADMINISTRATOR EXISTS WITH THIS USERNAME
      const adminFound = await this.administratorService.findByUsername(
        username,
      );
      if (adminFound !== null) {
        throw new BadRequestException('You cannot use this username');
      }
      // VALIDATE IF A SUPERADMIN EXISTS WITH THIS USERNAME
      const superadminFound = await this.superadminService.findByUsername(
        username,
      );
      if (superadminFound !== null) {
        throw new BadRequestException('You cannot use this username');
      }
      await this.employeeService.documentExists(employee);
      await this.subCompanyService.documentExists(sub_company);
      await this.campusService.documentExists(campus);
      const roleFound = await this.roleService.findOneByName(
        ValidRoles.coordinator,
      );
      const newCoordinator = new this.coordinatorModel({
        ...createCoordinatorDto,
        role: roleFound._id,
      });
      newCoordinator.password = bcrypt.hashSync(password, 10);
      await newCoordinator.save();
      console.log('Coordinator created successfully');
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<Coordinator[]> {
    try {
      const coordinatorsFound = await this.coordinatorModel.aggregate([
        ...employeeQuery,
        ...coordinatorQuery,
      ]);
      console.log('Coordinators found successfully');
      return coordinatorsFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.coordinatorModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(
          `Coordinator with id ${id} does not exists`,
        );
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findByUsername(username: string): Promise<Coordinator> {
    try {
      const userFound = await this.coordinatorModel
        .findOne({ username })
        .populate('role', 'name')
        .populate('sub_company', 'name');
      return userFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findById(id: string): Promise<Coordinator> {
    try {
      const userFound = await this.coordinatorModel.findById(id);
      console.log('Coordinator found successfully');
      return userFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async update(
    id: string,
    updateCoordinatorDto: UpdateCoordinatorDto,
  ): Promise<void> {
    try {
      await this.documentExists(id);
      await this.coordinatorModel.findByIdAndUpdate(id, updateCoordinatorDto);
      console.log(`Coordinator with id ${id} was updated successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.documentExists(id);
      await this.coordinatorModel.findByIdAndDelete(id);
      console.log(`Coordinator with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
