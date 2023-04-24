import { isValidObjectId } from 'mongoose';
import { removeDuplicates } from 'src/utils/utils';
import { DeviceService } from 'src/device/device.service';
import { AccessGroupService } from 'src/access_group/access_group.service';
import { UpdateAccessGroupDto } from 'src/access_group/dto/update-access_group.dto';
import {
  Inject,
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class UpdateParseDevicesPipe implements PipeTransform {
  constructor(
    @Inject(DeviceService)
    private deviceService: DeviceService,
    @Inject(AccessGroupService)
    private accessGroupService: AccessGroupService,
  ) {}

  existsDevice = async (device_id: string): Promise<void> => {
    try {
      await this.deviceService.documentExists(device_id);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  };

  existsDeviceInOtherGroup = async (
    device_id: string,
    access_group_id: string,
  ) => {
    try {
      const accessGroupsFound = await this.accessGroupService.findByDevice(
        device_id,
      );
      if (accessGroupsFound.length > 0) {
        const currentId = accessGroupsFound[0]._id.toString();
        if (currentId !== access_group_id) {
          throw new BadRequestException(
            `The device ${device_id} is already in use for another access group`,
          );
        }
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  };

  validateMongoId = (id: string): void => {
    const isValidMongoId = isValidObjectId(id);
    if (!isValidMongoId) {
      throw new BadRequestException('The devices must be a valid mongo id');
    }
  };

  async transform(value: UpdateAccessGroupDto, metadata: ArgumentMetadata) {
    const { device, access_group_id } = value;
    if (!device) return value;
    let newDevices = [];
    const areMoreThanOne = device.includes(',');
    if (areMoreThanOne) {
      newDevices = device.split(',');
      newDevices = removeDuplicates(newDevices);
      for (let device_id of newDevices) {
        this.validateMongoId(device_id);
        await this.existsDevice(device_id);
        await this.existsDeviceInOtherGroup(device_id, access_group_id);
      }
      return {
        ...value,
        device: newDevices,
      };
    }
    this.validateMongoId(device);
    await this.existsDevice(device);
    await this.existsDeviceInOtherGroup(device, access_group_id);
    return value;
  }
}
