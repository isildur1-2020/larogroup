import { campusQuery } from 'src/common/queries/campusQuery';
// import { employeeQuery } from 'src/common/queries/employeeQuery';

export const coordinatorQuery = [
  // {
  //   $lookup: {
  //     from: 'employees',
  //     localField: 'employee',
  //     foreignField: '_id',
  //     as: 'employee',
  //     pipeline: [...employeeQuery],
  //   },
  // },
  ...campusQuery,
  {
    $project: {
      role: 0,
      password: 0,
      is_active: 0,
      createdAt: 0,
      updatedAt: 0,
    },
  },
];
