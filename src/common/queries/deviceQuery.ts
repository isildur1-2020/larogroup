import { campusQuery } from './campusQuery';

export const deviceQuery = [
  {
    $lookup: {
      from: 'devices',
      localField: 'device',
      foreignField: '_id',
      as: 'device',
      pipeline: [...campusQuery],
    },
  },
  { $unwind: '$device' },
  {
    $project: {
      updatedAt: 0,
    },
  },
];
