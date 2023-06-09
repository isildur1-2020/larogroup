import { zoneQuery } from './zoneQuery';
import { campusQuery } from './campusQuery';
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
        ...campusQuery,
        ...zoneQuery,
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ],
      as: 'device',
    },
  },
];
