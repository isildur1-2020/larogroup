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
  {
    $unwind: {
      path: '$campus',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $project: {
      updatedAt: 0,
    },
  },
];
