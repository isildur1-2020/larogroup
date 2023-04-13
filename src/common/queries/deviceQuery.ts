import { subcompanyQuery } from './subcompanyQuery';

export const deviceQuery = [
  {
    $lookup: {
      from: 'campus',
      localField: 'campus',
      foreignField: '_id',
      as: 'campus',
      pipeline: [...subcompanyQuery],
    },
  },
  { $unwind: '$campus' },
  {
    $project: {
      updatedAt: 0,
    },
  },
];
