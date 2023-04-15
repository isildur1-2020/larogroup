import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilePictureService } from './profile_picture.service';
import { ProfilePictureController } from './profile_picture.controller';
import {
  ProfilePicture,
  ProfilePictureSchema,
} from './entities/profile_picture.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProfilePicture.name,
        schema: ProfilePictureSchema,
      },
    ]),
  ],
  controllers: [ProfilePictureController],
  providers: [ProfilePictureService],
  exports: [ProfilePictureService],
})
export class ProfilePictureModule {}
