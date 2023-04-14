import { employeeQuery } from './employeeQuery';
import { deviceQuery } from './deviceQuery';
import { reasonQuery } from './reasonQuery';
import { authMethodQuery } from './authMethodQuery';

export const authRecordQuery = [
  ...deviceQuery,
  ...employeeQuery,
  ...authMethodQuery,
  ...reasonQuery,
  {
    $project: {
      updatedAt: 0,
    },
  },
];
