import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { ReasonService } from './reason.service';
import { CreateReasonDto } from './dto/create-reason.dto';
import { UpdateReasonDto } from './dto/update-reason.dto';
import { Auth } from 'src/auth/decorators/auth-decorator.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('reason')
export class ReasonController {
  constructor(private readonly reasonService: ReasonService) {}

  @Post()
  @Auth(ValidRoles.superadmin)
  create(@Body() createReasonDto: CreateReasonDto) {
    return this.reasonService.create(createReasonDto);
  }

  @Get()
  @Auth(ValidRoles.superadmin)
  findAll() {
    return this.reasonService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.superadmin)
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.reasonService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.superadmin)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateReasonDto: UpdateReasonDto,
  ) {
    return this.reasonService.update(id, updateReasonDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.superadmin)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.reasonService.remove(id);
  }
}
