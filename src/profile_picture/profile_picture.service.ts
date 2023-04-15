import * as fs from 'fs';
import * as path from 'path';
import { Model } from 'mongoose';
import { filePath } from 'src/utils/filePath';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateProfilePictureDto } from './dto/update-profile_picture.dto';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ProfilePicture,
  ProfilePictureDocument,
} from './entities/profile_picture.entity';

@Injectable()
export class ProfilePictureService {
  constructor(
    @InjectModel(ProfilePicture.name)
    private profilePictureModel: Model<ProfilePictureDocument>,
  ) {}

  async create(file: Express.Multer.File): Promise<ProfilePicture> {
    try {
      if (!file) {
        throw new BadRequestException('The profile picture file is required');
      }
      const picturePath = `${filePath.profilePictures}/${file.filename}`;
      const newProfilePicture = new this.profilePictureModel({
        url: picturePath,
      });
      const profilePictureCreated = await newProfilePicture.save();
      console.log('Profile picture created successfully');
      return profilePictureCreated;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<ProfilePicture[]> {
    try {
      const profilePicturesFound = await this.profilePictureModel.aggregate([
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ]);
      console.log('Profile pictures found successfully');
      return profilePicturesFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findOne(id: string): Promise<ProfilePicture> {
    try {
      const profilePictureFound = await this.profilePictureModel.findById(id);
      if (profilePictureFound === null) {
        throw new BadRequestException(
          `Profile picture with id ${id} does not exists`,
        );
      }
      console.log('Profile picture with found successfully');
      return profilePictureFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  update(id: string, updateProfilePictureDto: UpdateProfilePictureDto) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    try {
      const profilePictureFound = await this.findOne(id);
      const { url } = profilePictureFound;
      const picturePath = path.join(__dirname, '../../', filePath.root, url);
      fs.unlinkSync(picturePath);
      await this.profilePictureModel.findByIdAndDelete(id);
      console.log(`Profile picture with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
