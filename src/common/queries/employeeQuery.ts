import { dniQuery } from './dniQuery';
import { roleQuery } from './roleQuery';
import { cityQuery } from './cityQuery';
import { campusQuery } from './campusQuery';
import { deviceQuery } from './deviceQuery';
import { subcompanyQuery } from './subcompanyQuery';
import { categoriesQuery } from './categoriesQuery';
import { profilePictureQuery } from './profilePictureQuery';

export const employeeQuery = [
  // ACCESS GROUP
  {
    $lookup: {
      from: 'accessgroups',
      let: { pid: '$access_group' },
      pipeline: [
        { $match: { $expr: { $in: ['$_id', '$$pid'] } } },
        ...subcompanyQuery,
        ...deviceQuery,
        {
          $project: {
            sub_company: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ],
      as: 'access_group',
    },
  },
  ...dniQuery,
  ...roleQuery,
  ...cityQuery,
  ...campusQuery,
  ...categoriesQuery,
  ...profilePictureQuery,
  {
    $project: {
      createdAt: 0,
      updatedAt: 0,
      current_zone: 0,
    },
  },
];
