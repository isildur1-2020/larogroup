import { deviceQuery } from './deviceQuery';

export const accessGroupQuery = [
  // ACCESS GROUP
  {
    $lookup: {
      from: 'accessgroups',
      localField: 'access_group',
      foreignField: '_id',
      as: 'access_group',
      pipeline: [
        ...deviceQuery,
        {
          $project: {
            sub_company: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ],
    },
  },
];
