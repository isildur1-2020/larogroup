import { employeeQuery } from 'src/employee/queries/employeeQuery';

export const barcodeQuery = [
  {
    $lookup: {
      from: 'employees',
      foreignField: '_id',
      localField: 'employee',
      as: 'employee',
      pipeline: [...employeeQuery],
    },
  },
  { $unwind: '$employee' },
  {
    $project: {
      createdAt: 0,
      updatedAt: 0,
    },
  },
];
