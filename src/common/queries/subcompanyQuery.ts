import { cityQuery } from './cityQuery';
import { companyQuery } from './companyQuery';

export const subcompanyQuery = [
  {
    $lookup: {
      from: 'subcompanies',
      localField: 'sub_company',
      foreignField: '_id',
      as: 'sub_company',
      pipeline: [...companyQuery, ...cityQuery],
    },
  },
  { $unwind: '$sub_company' },
  {
    $project: {
      createdAt: 0,
      updatedAt: 0,
    },
  },
];
