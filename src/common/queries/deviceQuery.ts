import { directionQuery } from './directionQuery';

export const deviceQuery = [
  // DEVICE
  {
    $lookup: {
      from: 'devices',
      let: { pid: '$device' },
      pipeline: [
        { $match: { $expr: { $in: ['$_id', '$$pid'] } } },
        ...directionQuery,
        {
          $project: {
            campus: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ],
      as: 'device',
    },
  },
];
