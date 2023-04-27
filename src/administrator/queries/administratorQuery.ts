import { companyQuery } from 'src/common/queries/companyQuery';

export const administratorQuery = [
  ...companyQuery,
  {
    $project: {
      role: 0,
      password: 0,
      is_active: 0,
      updatedAt: 0,
    },
  },
];
