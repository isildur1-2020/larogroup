import { PartialType } from '@nestjs/mapped-types';
import { CreateProfilePictureDto } from './create-profile_picture.dto';

export class UpdateProfilePictureDto extends PartialType(CreateProfilePictureDto) {}
