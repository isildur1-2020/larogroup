import { subcompanyQuery } from './subcompanyQuery';

export const campusQuery = [
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
      createdAt: 0,
      updatedAt: 0,
    },
  },
];
