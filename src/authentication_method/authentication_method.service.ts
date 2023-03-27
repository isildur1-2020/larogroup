import { Model } from 'mongoose';
import { CreateAuthenticationMethodDto } from './dto/create-authentication_method.dto';
import { UpdateAuthenticationMethodDto } from './dto/update-authentication_method.dto';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AuthenticationMethod,
  AuthenticationMethodDocument,
} from './entities/authentication_method.entity';

@Injectable()
export class AuthenticationMethodService {
  constructor(
    @InjectModel(AuthenticationMethod.name)
    private authenticationMethodModel: Model<AuthenticationMethodDocument>,
  ) {}

  async create(
    createAuthenticationMethodDto: CreateAuthenticationMethodDto,
  ): Promise<AuthenticationMethod> {
    try {
      const newAuthenticationMethod = new this.authenticationMethodModel(
        createAuthenticationMethodDto,
      );
      const authenticationMethodCreated = await newAuthenticationMethod.save();
      console.log('Authentication method created successfully');
      return authenticationMethodCreated;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<AuthenticationMethod[]> {
    try {
      const authenticationMethodsFound =
        await this.authenticationMethodModel.find();
      console.log('Authentication methods found successfully');
      return authenticationMethodsFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.authenticationMethodModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(
          `Authentication method with id ${id} does not exists`,
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

  update(
    id: number,
    updateAuthenticationMethodDto: UpdateAuthenticationMethodDto,
  ) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    try {
      await this.authenticationMethodModel.findByIdAndDelete(id);
      console.log(
        `Authentication method with id ${id} was deleted successfully`,
      );
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
