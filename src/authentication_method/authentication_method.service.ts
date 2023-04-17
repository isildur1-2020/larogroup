import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAuthenticationMethodDto } from './dto/create-authentication_method.dto';
import { UpdateAuthenticationMethodDto } from './dto/update-authentication_method.dto';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
  ): Promise<void> {
    try {
      const newAuthenticationMethod = new this.authenticationMethodModel(
        createAuthenticationMethodDto,
      );
      await newAuthenticationMethod.save();
      console.log('Authentication method created successfully');
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<AuthenticationMethod[]> {
    try {
      const authenticationMethodsFound =
        await this.authenticationMethodModel.aggregate([
          {
            $project: {
              key: 0,
              createdAt: 0,
              updatedAt: 0,
            },
          },
        ]);
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

  findOne(id: string) {
    throw new NotFoundException();
  }

  async findOneByKey(key: string): Promise<AuthenticationMethod> {
    try {
      const authMethodFound = await this.authenticationMethodModel.findOne({
        key,
      });
      if (authMethodFound === null) {
        throw new BadRequestException('Auth method does not exists');
      }
      return authMethodFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async update(
    id: string,
    updateAuthenticationMethodDto: UpdateAuthenticationMethodDto,
  ): Promise<void> {
    try {
      await this.documentExists(id);
      await this.authenticationMethodModel.findByIdAndUpdate(
        id,
        updateAuthenticationMethodDto,
      );
      console.log(
        `Authentication method with id ${id} was updated successfully`,
      );
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.documentExists(id);
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
