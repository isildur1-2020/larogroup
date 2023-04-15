import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { filePath } from 'src/utils/filePath';
import { fileFilter, fileNamer } from 'src/common/multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilePictureService } from './profile_picture.service';
import { UpdateProfilePictureDto } from './dto/update-profile_picture.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('profile-picture')
export class ProfilePictureController {
  constructor(private readonly profilePictureService: ProfilePictureService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('picture', {
      fileFilter,
      storage: diskStorage({
        destination: `.${filePath.root}${filePath.profilePictures}`,
        filename: fileNamer,
      }),
    }),
  )
  create(@UploadedFile() file: Express.Multer.File) {
    return this.profilePictureService.create(file);
  }

  @Get()
  findAll() {
    return this.profilePictureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.profilePictureService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateProfilePictureDto: UpdateProfilePictureDto,
  ) {
    return this.profilePictureService.update(id, updateProfilePictureDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.profilePictureService.remove(id);
  }
}
