import { deviceQuery } from './deviceQuery';
import { subcompanyQuery } from './subcompanyQuery';

export const accessGroupQuery = [
  // ACCESS GROUP
  {
    $lookup: {
      from: 'accessgroups',
      localField: 'access_group',
      foreignField: '_id',
      as: 'accessgroup',
      pipeline: [
        ...subcompanyQuery,
        ...deviceQuery,
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ],
    },
  },
  {
    $unwind: {
      path: '$accessgroup',
      preserveNullAndEmptyArrays: true,
    },
  },
];
