import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { CoordinatorService } from './coordinator.service';
import { CreateCoordinatorDto } from './dto/create-coordinator.dto';
import { UpdateCoordinatorDto } from './dto/update-coordinator.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('coordinator')
export class CoordinatorController {
  constructor(private readonly coordinatorService: CoordinatorService) {}

  @Post()
  create(@Body() createCoordinatorDto: CreateCoordinatorDto) {
    return this.coordinatorService.create(createCoordinatorDto);
  }

  @Get()
  findAll() {
    return this.coordinatorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coordinatorService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateCoordinatorDto: UpdateCoordinatorDto,
  ) {
    return this.coordinatorService.update(id, updateCoordinatorDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.coordinatorService.remove(id);
  }
}
