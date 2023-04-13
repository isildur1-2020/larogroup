import { countryQuery } from './countryQuery';

export const cityQuery = [
  {
    $lookup: {
      from: 'cities',
      localField: 'city',
      foreignField: '_id',
      as: 'city',
      pipeline: [...countryQuery],
    },
  },
  { $unwind: '$city' },
];
