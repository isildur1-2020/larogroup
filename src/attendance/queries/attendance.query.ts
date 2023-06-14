import { zoneQuery } from '../../common/queries/zoneQuery';
import { campusQuery } from 'src/common/queries/campusQuery';
import { vehicleQuery } from 'src/common/queries/vehicleQuery';
import { employeeQuery } from 'src/common/queries/employeeQuery';
import { directionQuery } from 'src/common/queries/directionQuery';

export const attendanceQuery = [
  // ZONE
  ...zoneQuery,
  // VEHICLES
  {
    $lookup: {
      from: 'vehicles',
      localField: 'vehicle',
      foreignField: '_id',
      as: 'vehicle',
      pipeline: [...vehicleQuery],
    },
  },
  {
    $unwind: {
      path: '$vehicle',
      preserveNullAndEmptyArrays: true,
    },
  },
  // EMPLOYEE
  {
    $lookup: {
      from: 'employees',
      localField: 'employee',
      foreignField: '_id',
      as: 'employee',
      pipeline: [
        ...employeeQuery,
        {
          $project: {
            access_group: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ],
    },
  },
  {
    $unwind: {
      path: '$employee',
      preserveNullAndEmptyArrays: true,
    },
  },
  // DEVICE
  {
    $lookup: {
      from: 'devices',
      localField: 'device',
      foreignField: '_id',
      as: 'device',
      pipeline: [
        ...campusQuery,
        ...directionQuery,
        {
          $project: {
            zone: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ],
    },
  },
  { $unwind: '$device' },
  {
    $project: {
      updatedAt: 0,
    },
  },
];
