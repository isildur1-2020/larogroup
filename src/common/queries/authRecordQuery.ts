import { deviceQuery } from './deviceQuery';
import { vehicleQuery } from './vehicleQuery';
import { employeeQuery } from './employeeQuery';
import { authMethodQuery } from './authMethodQuery';
import { directionQuery } from './directionQuery';

export const authRecordQuery = [
  // DEVICES
  ...authMethodQuery,
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
  {
    $project: {
      createdAt: 0,
      updatedAt: 0,
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
  { $unwind: '$employee' },
  {
    $project: {
      createdAt: 0,
      updatedAt: 0,
    },
  },
  // ...employeeQuery,
  // ...vehicleQuery,
  // ...employeeQuery,
  {
    $project: {
      createdAt: 0,
      updatedAt: 0,
    },
  },
];
