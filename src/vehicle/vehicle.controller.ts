import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Auth } from 'src/auth/decorators/auth-decorator.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { ParseAccessGroupPipe } from 'src/common/pipes/parse-access-group/parse-access-group.pipe';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  create(@Body(ParseAccessGroupPipe) createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.create(createVehicleDto);
  }

  @Get()
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  findAll() {
    return this.vehicleService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  findOne(@Param('id') id: string) {
    return this.vehicleService.findOne(+id);
  }

  @Patch(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body(ParseAccessGroupPipe) updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehicleService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.vehicleService.remove(id);
  }
}
