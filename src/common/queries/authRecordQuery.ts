import { vehicleQuery } from './vehicleQuery';
import { employeeQuery } from './employeeQuery';
import { authMethodQuery } from './authMethodQuery';
import { directionQuery } from './directionQuery';

export const authRecordQuery = [
  ...authMethodQuery,
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
  // DEVICES
  {
    $lookup: {
      from: 'devices',
      localField: 'device',
      foreignField: '_id',
      as: 'device',
      pipeline: [
        ...directionQuery,
        {
          $project: {
            campus: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ],
    },
  },
  { $unwind: '$device' },
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
  // GLOBAL PROJECT
  {
    $project: {
      updatedAt: 0,
    },
  },
];
