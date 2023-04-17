import { deviceQuery } from './deviceQuery';
import { employeeQuery } from './employeeQuery';
import { authMethodQuery } from './authMethodQuery';

export const authRecordQuery = [
  ...deviceQuery,
  ...employeeQuery,
  ...authMethodQuery,
  {
    $lookup: {
      from: 'employees',
      localField: 'entity',
      foreignField: '_id',
      as: 'employee',
      pipeline: [...employeeQuery],
    },
  },
  {
    $unwind: {
      path: '$employee',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: 'vehicles',
      localField: 'entity',
      foreignField: '_id',
      as: 'vehicle',
    },
  },
  {
    $unwind: {
      path: '$vehicle',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $project: {
      updatedAt: 0,
    },
  },
];
